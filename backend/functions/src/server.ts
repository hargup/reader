import express from 'express';
import { container } from 'tsyringe';
import { CrawlerHost } from './cloud-functions/crawler';

const app = express();
const port = process.env.PORT || 3000;

const crawlerHost = container.resolve(CrawlerHost);

app.use(express.json());

app.post('/crawl', async (req, res) => {
  try {
    await crawlerHost.crawl(req, res);
  } catch (error) {
    console.error('Error during crawl:', error);
    res.status(500).json({ error: 'An error occurred during the crawl' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
import express from 'express';
import { container } from 'tsyringe';
import { CrawlerHost } from './cloud-functions/crawler';

const app = express();
const port = process.env.PORT || 3000;

const crawlerHost = container.resolve(CrawlerHost);

app.use(express.json());

app.post('/crawl', async (req, res) => {
  try {
    await crawlerHost.crawl(req, res);
  } catch (error) {
    console.error('Error during crawl:', error);
    res.status(500).json({ error: 'An error occurred during the crawl' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
