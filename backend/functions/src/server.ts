import "reflect-metadata"
import express from 'express';
import { container } from 'tsyringe';
import { CrawlerHost } from './cloud-functions/crawler';

const app = express();
const port = process.env.PORT || 3000;

container.registerSingleton(CrawlerHost);

const crawlerHost = container.resolve(CrawlerHost);

app.use(express.json());

// Example curl for /crawl:
// curl -X GET "http://localhost:3000/https://example.com"
app.get('/:url(*)', async (req, res) => {
  try {
    const url = req.params.url;
    await crawlerHost.crawl(req, res);
  } catch (error) {
    console.error('Error during crawl:', error);
    res.status(500).json({ error: 'An error occurred during the crawl' });
  }
});

// Example curl for /hello:
// curl -X GET "http://localhost:3000/hello"
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;