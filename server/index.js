const express = require('express');
const puppeteer = require('puppeteer-core');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/pdf', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: 'A ?url query-parameter is required' });
    }

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=1cd0f188-03ec-42cb-b866-762258c9002c`,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url);

    const pdfBuffer = await page.pdf();
    res.status(200).header('Content-Type', 'application/pdf').send(pdfBuffer);

    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
