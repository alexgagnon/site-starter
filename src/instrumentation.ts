import { register } from 'node:module';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

register(
  '@opentelemetry/instrumentation/hook.mjs',
  new URL('./', import.meta.url)
);

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('tracing terminated'))
    .catch((error) => console.error(error, 'error terminating tracing'))
    .finally(() => process.exit(0));
});
