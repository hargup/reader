import 'reflect-metadata';
import { initializeApp } from 'firebase-admin/app';
import { CrawlerHost } from './cloud-functions/crawler';
import { https } from 'firebase-functions';
import { Logger } from './shared/logger';
import { container } from 'tsyringe';
import { PuppeteerControl } from './services/puppeteer';
import { JSDomControl } from './services/jsdom';
import { FirebaseStorageBucketControl } from './shared';
import { AsyncContext } from './shared';

initializeApp();

container.registerSingleton(Logger);
container.registerSingleton(PuppeteerControl);
container.registerSingleton(JSDomControl);
container.registerSingleton(FirebaseStorageBucketControl);
container.registerSingleton(AsyncContext);
container.registerSingleton(CrawlerHost);

const crawlerHost = container.resolve(CrawlerHost);
export const crawler = https.onRequest(async (req, res) => {
    await crawlerHost.crawl(req, res);
});
// import { loadModulesDynamically, registry } from './shared';
// import path from 'path';
// loadModulesDynamically(path.resolve(__dirname, 'cloud-functions'));

// Object.assign(exports, registry.exportAll());
// Object.assign(exports, registry.exportGrouped({
//     memory: '4GiB',
//     timeoutSeconds: 540,
// }));
// registry.allHandsOnDeck().catch(() => void 0);
// registry.title = 'reader';
// registry.version = '0.1.0';

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);

    // Looks like Firebase runtime does not handle error properly.
    // Make sure to quit the process.
    process.nextTick(() => process.exit(1));
    console.error('Uncaught exception, process quit.');
    throw err;
});
