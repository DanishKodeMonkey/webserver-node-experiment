# web server node exercise

An exercise in the use of node.js, setting up a web server.

A short and simple web server deployed using a node.js web server solution.

The process of setting up a web server using node.js can seem daunting at first, but the process can be straight forward using some appropriate techniques:

## Step 1. The setup

First of, having node installed is a given, [read more about that here](https://nodejs.org/en)

Then we initialize node in the root of our project:

```
 npm init -y
```

using the -y flag (or yes flag) will effectively answer yes to all the initializer questions, feel free to omit the -y flag to gain more fine control over the initialization.

With node and NPM set up, were now ready to begin installing packages!
Now, in order to set up a basic web server, we needed two packages in particular:

```
npm install http fs
```

-   The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use. In particular, large, possibly chunk-encoded, messages. The interface is careful to never buffer entire requests or responses, so the user is able to stream data.
    -- [More on the http package](https://nodejs.org/api/http.html)

-   The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.
    --[More on the fs package](https://nodejs.org/api/fs.html)

With this, our setup is complete!

## Step 2. The website

The website for this exercise will consist of 4 simple html pages
We create a pages folder, wherein we house 4 html pages.

![file structure](./images/files.png)

These html files are almost identical in their individual setup, only the body has some differences so we actually render something.

<img src="./images/indexhtml.png" alt="index html" width="500">

## Step 3. the web server

In order to start our new amazing website we need to serve them to the user, hence the web server.

Thanks to the leveraging of node.js we can do this in javascript!

So we make a index.js file in the root of our project (see image in step 2) and write up the web server logic:

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const htmlFiles = {
    '/': './pages/index.html',
    '/contact-me': './pages/contact-me.html',
    '/about': './pages/about.html',
    '/404': './pages/404.html',
};

const server = http.createServer((req, res) => {
    const requestedUrl = req.url;
    const htmlFile = htmlFiles[requestedUrl] || './pages/404.html';

    fs.readFile(path.join(__dirname, htmlFile), (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
                if (err) {
                    console.log(`Error reading file ${htmlFile}`);
                    res.end('404 Not Found');
                } else {
                    console.log('serving 404 html');
                    res.end(data);
                }
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

### Let's break this down:

## 1. Import requirements

First of, we import the modules we got earlier first by requirement.

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
```

This will allow us to reference these modules through the constants we have initialized.

## 2. Connect URL pathing to corresponding file path

Create an object connecting each html file we created to a corresponding url path

```javascript
const htmlFiles = {
    '/': './pages/index.html',
    '/contact-me': './pages/contact-me.html',
    '/about': './pages/about.html',
    '/404': './pages/404.html',
};
```

This gives us a convenient place to store additional places if needed, and find paths if we need a reference.

Having this all in one place adds to our readability score.

## 3. Create the server

The main block of this logic pertains to the HTTP request/response logic

#### 1. Initialize web server

First, we set up a web

```javascript
const server = http.createServer((req, res) => {});
```

Inside the arrow function we will handle the request/response (req, res) logic

#### 2. Handle request objects.

the req that we will be receiving will be the HTTP request object sent when a user inputs a url in their browser.
e.g `http://localhost.3000/contact-me` will return an object including a url key and path value `/contact-me`

For convenience we will handle this extraction in a constant

```javascript
const requestedUrl = req.url;
```

#### 3. search htmlFiles object for requested page

We can now look up the requested URL in the htmlFiles object, in order to get the corresponding HTML file path.

```javascript
const htmlFile = htmlFiles[requestedUrl] || './pages/404.html';
```

This will either return the corresponding file path, or the 404 page not found page we made.

#### 4. Reading HTML

We now have to read the HTML of the file we got earlier `htmlFile`

This is where the fs module comes in to play, allowing us to read from the file system.

We will construct the absolute path to the HTML file, by joining the current directory `__dirname`with the file path we got earlier. And read it using the fs.readFile method.

```javascript
fs.readFile(path.join(__dirname, htmlFile), (err, data) => {});
```

This will return one of two objects, an error (err) object, or a data object; the contents of the file.

Using an arrow function, we can now process this file.

#### 5. Handling errors first

Handling errors first is a good idea, it'll allow us to cut the program short if anything has gone wrong and report it
back as needed.

So if readFile returned an err object, we can handle it by writing responding the 404.html file to the browser.

```javascript
if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
                if (err) {
                    console.log(`Error reading file ${htmlFile}`);
                    res.end('404 Not Found');
                } else {
                    console.log('serving 404 html');
                    res.end(data);
                }
            });
```

I got some laughs when I presented this one.

What happens here, is that if we were returned a err object, we will establish a response header with the HTTP code 404, and attempt to read the 404.html page.

Having ANOTHER error conditional here will allow us to handle a case where 404.html may not exist for whatever reason, and gracefully add 404 Not found to the end of the HTTP response, and printing to console to alert a developer that something is wrong.

It may seem overkill, solving an error for an error case, but it felt graceful to atleast cover this situation as well.

If all goes well in reading a 404.html file, it exist, and we attach it to the end of the HTTP response, so the browser can display it.

### Now lets handle an actual sucessful case.

This one is pretty straight forward, if we were not returned an error object, then all went well finding the requested URLs corresponding file, so we can attach that to the end of the HTTP response.

```javascript
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
```

So we write a header, with the HTTP code 200 OK response, and attached the data to the body. Off this goes to the requesting browser!

#### 6. Open the flood gates

In order to actually receive requests, we need to tell our server to listen for them at the ports.

This can be any port, and for security reasons these would best be held in a .env file to prevent accidentally sending dangerous information to malicious outsiders. In this case though, it's a local host, just us playing around, so we will just use port 3000 to listen to a request locally.

-   IF you ever intend to expose your system to the actual internet, ALWAYS take appropriate measures to secure your data.

```javascript
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

Through this, we initialize a global constant, PORT, either through a .env value, or a default value of 3000.
We then tell the server we initialized at the start to listen to this port, and send a notification of this to the console.

## 4. And were ready to serve!

With this, were ready to serve! To start this, we will have to tell node to start this program in runtime.
SO in your terminal, tell node to do just that with

```
node index.js
```

Telling node to run the index.js file, and it's contents.

![terminal node index.js](./images/node.png)

And now, we can visit `http://localhost:3000/`and request a page using the URL paths

Remember our htmlFiles object?

```javascript
const htmlFiles = {
    '/': './pages/index.html',
    '/contact-me': './pages/contact-me.html',
    '/about': './pages/about.html',
    '/404': './pages/404.html',
};
```

the index page (default path at url /)

![index page](./images/index.png)

The contact-me page(/contact-me url)

![contact-me page](./images/contact-me.png)

ETC.

# CONGRATULATIONS! Were now serving our website! And learnt why it's called a "web server"
