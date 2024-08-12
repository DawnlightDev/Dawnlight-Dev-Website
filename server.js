const express = require('express');
const fs = require('fs');
const jsdom = require('jsdom');
const path = require('path');
const { JSDOM } = jsdom;

const app = express();
const port = process.env.PORT

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Configure Express to look for EJS templates in multiple directories
app.set('views', [
    __dirname,                 // Root directory
    path.join(__dirname, 'sub'),   // 'sub' directory
    path.join(__dirname, 'blog-posts') // 'blog-posts' directory
]);

// Serve static files from the root directory
app.use(express.static(__dirname));

// Define a route for the root path
app.get('/', (req, res) => {
    // Render the index.ejs template from the root directory
    res.render('index');
});

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/games', (req, res) => {
    res.render('games');
});

// Define a route to handle the blog posts
app.get('/sub/magical-girl-saga-devlogs', (req, res) => {
    // Read the directory /blog-posts
    fs.readdir(path.join(__dirname, 'blog-posts'), (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }

        // Process each HTML file
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(__dirname, 'blog-posts', file), 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return reject('Error reading file');
                    }

                    const dom = new JSDOM(data);
                    const title = dom.window.document.querySelector('h1#post-title').textContent;
                    const subtitle = dom.window.document.querySelector('h2#post-title').textContent;
                    const content = dom.window.document.querySelector('p').textContent;
                    const thumbnailimg = dom.window.document.querySelector("img#postimg").src;
                    const url = `/blog-posts/${file.replace('.ejs', '')}`;

                    // Extract the numeric part from the title
                    const numericPart = title.match(/\d+/);
                    const postNumber = numericPart ? parseInt(numericPart[0]) : 0;

                    // Limit the preview to the first 50 words
                    const preview = content.split(' ').slice(0, 15).join(' ') + '...';

                    // Create HTML markup for the post card
                    const postMarkup = `<div class="post-card">
                                            <img id="cardimg" src="${thumbnailimg}">
                                            <h3>${title}</h3>
                                            <h4>${subtitle}</h4>
                                            <p>${preview}</p>
                                            <a href="${url}">Read more</a>
                                        </div>`;
                    resolve({ postMarkup, postNumber });
                });
            });
        })).then(posts => {
            // Sort the posts by postNumber in descending order
            posts.sort((a, b) => b.postNumber - a.postNumber);

            // Render the page with all blog posts
            const responseData = posts.map(post => post.postMarkup).join('');
            res.render('magical-girl-saga-devlogs', { blogPosts: responseData });
        }).catch(error => {
            console.error(error);
            res.status(500).send('Error processing files');
        });
    });
});

// Define a route for individual blog posts
app.get('/blog-posts/:postName', (req, res) => {
    const postName = req.params.postName;

    // Render the EJS template for the specific blog post
    res.render(postName); // This assumes the file is in 'blog-posts' folder
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
