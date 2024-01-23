const express = require('express');
const path = require('path');
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(__dirname));

app.use('/blog-posts', express.static(path.join(__dirname, 'blog-posts')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define a route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/blog-posts', (req, res) => {
  // Fetch HTML files from the blog-posts directory
  const htmlFiles = fs.readdirSync('/blog-posts').filter(file => file.endsWith('.html'));

  // Process each HTML file and create post cards
  const posts = htmlFiles.map(file => {
    const filePath = path.join('/blog-posts/', file);

    // Read the content of the HTML file
    const postData = fs.readFileSync(filePath, 'utf-8');

    // Parse the HTML content using JSDOM
    const { document } = new JSDOM(postData).window;

    // Extract elements using DOM methods
    const titleElement = document.querySelector('h1#post-title');
    const subtitleElement = document.querySelector('h2#post-title');
    const contentElement = document.querySelector('p');
    const thumbnailElement = document.querySelector('img#postimg');

    // Check if elements exist before accessing properties
    const title = titleElement ? titleElement.textContent : 'No Title';
    const subtitle = subtitleElement ? subtitleElement.textContent : 'No Subtitle';
    const content = contentElement ? contentElement.textContent : 'No Content';
    const thumbnailimg = thumbnailElement ? thumbnailElement.src : 'No Thumbnail';

    // Extract the post number from the file name or content
    const postNumber = parseInt(file.match(/\d+/)[0]);

    // Limit the preview to the first 50 words
    const preview = content.split(' ').slice(0, 15).join(' ') + '...';

    // Create the HTML markup for each post card
    const postMarkup = '<div class="post-card">' + '<div id="flex-child">' +
      '<div id="cardimg" style="background-image: url(' + thumbnailimg + ');"></div>' +
      '<h3>' + title + '</h3>' +
      '<h4>' + subtitle + '</h4>' +
      '<p>' + preview + '</p>' +
      '<a href="' + file + '">Read more</a>' + '</div>' +
      '</div>';

    // Return post data
    return { postNumber, markup: postMarkup };
  });

  // Render the devlogs.html page with the posts data
  res.render('devlogs', { posts });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
