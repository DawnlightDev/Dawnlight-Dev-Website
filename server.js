const express = require('express');
const fs = require('fs');
const jsdom = require('jsdom');
const path = require('path');
const { JSDOM } = jsdom;

const app = express();

const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'sub'));

// Serve static files from the 'public' directory, excluding .ejs files
app.use(express.static(__dirname, {
    extensions: ['html', 'htm'] // Add more extensions if necessary
}));


// Define a route for the root path
app.get('/', (req, res) => {
    // Render your default HTML page (e.g., index.html) statically
    res.render(path.join(__dirname, 'index'));
});

app.get('/index', (req, res) => {
    res.render(path.join(__dirname, 'index'));
});

// Define a route for the root path
app.get('/about', (req, res) => {
    // Render your default HTML page (e.g., index.html) statically
    res.render(path.join(__dirname, 'about'));
});

// Define a route for the root path
app.get('/contact', (req, res) => {
    // Render your default HTML page (e.g., index.html) statically
    res.render(path.join(__dirname, 'contact'));
});

// Define a route for the root path
app.get('/games', (req, res) => {
    // Render your default HTML page (e.g., index.html) statically
    res.render(path.join(__dirname, 'games'));
});

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



// Define a route for blog posts
app.get('/blog-posts/:postName', (req, res) => {
    const postName = req.params.postName;
    const postFilePath = path.join(__dirname, 'blog-posts', postName + '.ejs');

    // Check if the requested EJS file exists
    fs.access(postFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file doesn't exist, return a 404 Not Found response
            res.status(404).send('Post not found');
        } else {
            // If the file exists, render it dynamically
            res.render(postFilePath); // Render the template using the full path
        }
    });
});




app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

//module.exports.handler = serverless(app);
