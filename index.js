const express = require('express');
const path = require('path');
const app = express();

// Serve images and content using app.use

app.use(express.static(path.join(__dirname, 'images')));
// use app.get to define routes to the appropriate pages
// the express methods will be chained where appropriate.

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});
app.get('/contact-me', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'contact-me.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/418', (req, res) => {
    res.status(418).sendFile(path.join(__dirname, 'pages', '418.html'));
});
// A catch all using asterisk wild cart for 404 responses.
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'pages', '404.html'));
});
// start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
