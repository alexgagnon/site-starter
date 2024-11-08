import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PlaywrightCrawler } from 'crawlee';
import { playAudit } from 'playwright-lighthouse';
import { previewUrl } from '../../package.json' with { type: 'json' };

const directory = 'lighthouse-report';
const pages: string[] = [];

const crawler = new PlaywrightCrawler({
    async requestHandler({ page, enqueueLinks, log }) {
        const title = (await page.title())?.split('|')[1]?.trim();
        log.info(`Checking ${title}...`);
        try {
          await playAudit({
            page: page,
            port: 10000,
            thresholds: {
              performance: 0,
              accessibility: 0,
              'best-practices': 0,
              seo: 0,
              pwa: undefined,
            },
            reports: {
              formats: {
                html: true,
              },
              directory,
              name: title,
            }
          });

          pages.push(`${title}.html`);
        } catch (error) {
          log.error(`Error while running Lighthouse audit: ${error as string}`);
        }
        finally {
          await enqueueLinks();
        }
    },

    headless: false,
    maxRequestsPerCrawl: 50,
    maxConcurrency: 1, // this needs to be one otherwise there's a port collision
    launchContext: {
      launchOptions: {
        args: ['--remote-debugging-port=10000'],
      }
    }
});

// Add first URL to the queue and start the crawl.
await crawler.run([previewUrl]);

await writeFile(join(directory, 'index.html'), `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lighthouse Reports</title>
  </head>
  <body>
    <h1>Lighthouse Reports</h1>
    <ul>
      ${pages.map(page => `<li><a href="${page}">${page}</a></li>`).join('')}
    </ul>
  </body>
  </html>`,
  { encoding: 'utf-8' }
);
