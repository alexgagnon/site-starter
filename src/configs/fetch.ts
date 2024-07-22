// we need to do this because native fetch (available w/o flag as of v18) does
// not support a custom http Agent and by default it will open a new connection
// for every request (httpAgent.keepAlive = false)
// https://learn.microsoft.com/en-us/azure/app-service/app-service-web-nodejs-best-practices-and-troubleshoot-guide#my-node-application-is-making-excessive-outbound-calls
// it's also best practice to use retries for network requests to handle errors

import nodeFetch from 'node-fetch';
import type { RequestInfo, RequestInit } from 'node-fetch';
import { HttpsAgent } from 'agentkeepalive';
import {
  RETRY_BACKOFF,
  MAX_RETRIES,
  MAX_SOCKETS,
  RETRY_DELAY,
  STATUSES_TO_RETRY,
  RETRY
} from './constants.js';

const agent = new HttpsAgent({
  maxSockets: MAX_SOCKETS,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000
});

// we augment the fetch function to use an agent that has better support for controlling
// the number of open connections and has retry logic
export async function fetch(
  input: URL | RequestInfo,
  init?: RequestInit,
  retry: boolean = RETRY,
  statusesToRetry = STATUSES_TO_RETRY,
  maxRetries = MAX_RETRIES,
  retryDelay = RETRY_DELAY,
  retryBackoff = RETRY_BACKOFF
) {
  let delay = retryDelay;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await nodeFetch(input, { agent, ...init });
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
      return response;
    } catch (error) {
      const status = error instanceof Error && parseInt(error.message);
      console.error(`Attempt ${attempt + 1} failed: ${status}`);
      if (
        retry &&
        statusesToRetry.includes(status) &&
        attempt < maxRetries - 1
      ) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = delay * retryBackoff;
      } else {
        throw error;
      }
    }
  }
}

global.fetch = () => {
  throw new Error(
    'Do not use native fetch, use fetch from "./configs/fetch" instead'
  );
};
