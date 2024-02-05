const express = require('express');
const path = require('path');
const blogPosts = require('./blogposts.js');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define a route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/mahou-shoujo-monogatari-devlogs', async (req, res) => {
  try {
    // Fetch blog posts
    const posts = await blogPosts.getPosts();

    // Read the content of devlogs.html
    const filePath = path.join(__dirname, 'mahou-shoujo-monogatari-devlogs.html');
    let htmlContent = await fs.readFile(filePath, 'utf-8');

    // Modify the HTML content based on the fetched blog posts
    const postsHTML = posts.map(post => `
      <div class="post">
        <h2>${post.title}</h2>
        <p>${post.content}</p>
      </div>
    `).join('');

    // Replace a placeholder in devlogs.html with the generated post HTML
    htmlContent = htmlContent.replace('<div id = "postcard">', postsHTML);

    // Set the Content-Type header to indicate HTML
    res.header('Content-Type', 'text/html');

    // Respond with the modified HTML content
    res.send(htmlContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/blog-posts', async (req, res) => {
  try {
    const posts = await blogPosts.getPosts();
    console.log(posts); // Wait for getPosts to complete before logging
    res.header('Content-Type', 'application/json');
    res.json(posts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
