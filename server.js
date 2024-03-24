const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

// Define a route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve devlogs.html using Express
app.get('/sub/mahou-shoujo-monogatari-devlogs.html', (req, res) => {
    fs.readFile(__dirname + '/sub/mahou-shoujo-monogatari-devlogs.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error loading devlogs.html');
        }
        res.send(data);
    });
});

// Serve blog posts from the server
app.get('/blog-posts', (req, res) => {
    const postsDirectory = path.join(__dirname, 'blog-posts');
    fs.readdir(postsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }
        
        // Read each HTML file and send the contents
        const postsData = [];
        files.forEach(file => {
            if (file.endsWith('.html')) {
                const filePath = path.join(postsDirectory, file);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        return;
                    }
                    const url = '/blog-posts/' + file; // Construct URL for the post
                    postsData.push(parsePost(data, url)); // Pass the URL to parsePost
                    if (postsData.length === files.length) {
                        res.json(postsData);
                    }
                });
            }
        });
    });
});

// Parse post data from HTML content
function parsePost(data, url) {
    const $ = cheerio.load(data);
    const title = $('h1#post-title').text();
    const subtitle = $('h2#post-subtitle').text();
    const content = $('div#video').html(); // Get HTML content
  const thumbnailImg = $('img#post-thumbnail').attr('src');
  const preview = $('p#preview').text().split(' ').slice(0, 15).join(' ') + '...';
    return { title, subtitle, content, preview, thumbnailImg, url };
}

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });

module.exports.handler = serverless(app);