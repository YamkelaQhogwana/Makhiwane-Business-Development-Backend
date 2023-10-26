const express = require('express');
const puppeteer = require('puppeteer-core');
const fs = require('fs'); // For file system operations
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=1cd0f188-03ec-42cb-b866-762258c9002c`,
    });

    const page = await browser.newPage();
    await page.setContent('<html><body><strong>Hello Yamkela</strong></body></html>');

    const pdfPath = 'MakhiwaneInvoice.pdf';
    await page.pdf({ path: pdfPath, format: 'A4' });

    const pdfBuffer = fs.readFileSync(pdfPath);
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
