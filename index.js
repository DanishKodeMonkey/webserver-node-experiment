const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// Map up URL paths with corresponding file paths in an object.

const htmlFiles = {
    // URL path - File path
    '/': './pages/index.html',
    '/contact-me': './pages/contact-me.html',
    '/about': './pages/about.html',
    '/404': './pages/404.html',
};

// Create server
app.get('*', (req, res) => {
    // get request URL and matching HTML file
    const requestedUrl = req.url;
    const htmlFile = htmlFiles[requestedUrl] || './pages/404.html';

    // Read the HTML file
    fs.readFile(path.join(__dirname, htmlFile), (err, data) => {
        if (err) {
            // if file not found, serve 404.html
            res.writeHead(404, { 'Content-Type': 'text/html' });
            fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
                // if even this fails, just write it
                if (err) {
                    console.log(`Error reading file ${htmlFile}`);
                    res.end('404 Not Found');
                } else {
                    console.log('serving 404 html');
                    // otherwise, serve 404.html
                    res.send(data);
                }
            });
        } else {
            // serve the HTML file
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

// start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
