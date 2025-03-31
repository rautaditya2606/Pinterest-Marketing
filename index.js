const express = require('express');
const puppeteer = require('puppeteer'); // Use puppeteer instead of puppeteer-core
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ejsMate = require('ejs-mate');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.get('/', (req, res) => {
    res.render('pinterest', { title: 'Screenshot App' });
});

app.post('/capture-screenshot', async (req, res) => {
    try {
        const { html } = req.body;
        const style = await fs.readFile(path.join(__dirname, 'public', 'css', 'style.css'), 'utf8');

        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process'
            ],
            headless: "new"
        });

        const page = await browser.newPage();

        await page.setContent(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap" rel="stylesheet">
                    <style>${style}</style>
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `, { waitUntil: 'networkidle0' });

        await page.evaluateHandle('document.fonts.ready');
        
        const height = await page.evaluate(() => document.documentElement.offsetHeight);
        await page.setViewport({
            width: 840,
            height: height,
            deviceScaleFactor: 2
        });

        const screenshot = await page.screenshot({
            type: 'png',
            fullPage: true,
            omitBackground: false
        });

        await browser.close();
        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).json({ message: 'Error capturing screenshot', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});