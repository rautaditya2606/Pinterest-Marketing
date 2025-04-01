const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Serve the main page
app.get('/', (req, res) => {
    res.render('pinterest');
});

// Handle screenshot capture – now sends the image file from public\image\infographic.png
app.post('/capture-screenshot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'image', 'infographic.png'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});