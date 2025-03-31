const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Serve the main page
app.get('/', (req, res) => {
    res.render('pinterest');
});

// Handle screenshot capture
app.post('/capture-screenshot', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Read CSS file
        const cssContent = await fs.readFile(path.join(__dirname, 'public', 'css', 'style.css'), 'utf8');
        
        // Set viewport size for the screenshot
        await page.setViewport({
            width: 800,
            height: 2000,
            deviceScaleFactor: 2
        });

        // Render the HTML content with inline CSS
        const htmlContent = `
            <html>
                <head>
                    <style>${cssContent}</style>
                </head>
                <body>
                    ${req.body.html}
                </body>
            </html>
        `;
        
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });

        // Wait for fonts to load
        await page.waitForFunction(() => document.fonts.ready);

        // Take screenshot
        const screenshot = await page.screenshot({
            type: 'png',
            fullPage: true,
            omitBackground: true
        });

        await browser.close();

        // Send the screenshot
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshot.length
        });
        res.end(screenshot);

    } catch (error) {
        console.error('Screenshot error:', error);
        res.status(500).send('Error generating screenshot');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});