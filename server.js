const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const serverless = require('serverless-http');
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

app.get('/blog-posts', async (req, res) => {
  try {
    const posts = await blogPosts.getPosts();
    console.log(posts); // Wait for getPosts to complete before logging
    res.json(posts);
    async function fetchAndRenderPosts() {
      try {
        // Fetch blog posts from the server
        const response = await fetch('/blog-posts');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const posts = await response.json();

        // Log the received posts to the console for debugging
        console.log('Received posts:', posts);

        // Render the posts
        renderPosts(posts);
      } catch (error) {
        console.error('Error fetching and rendering posts:', error);
      }
    }

    function renderPosts(posts) {
      const devlogsBody = document.getElementById('devlogs-body');

      // Clear existing content of devlogs-body
      devlogsBody.innerHTML = '';

      // Append the fetched posts to devlogs-body
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = post.markup;
        devlogsBody.appendChild(postElement.firstChild); // Append the first child of postElement (the post markup)
      });
    }

    // Fetch and render posts when the page loads
    document.addEventListener('DOMContentLoaded', fetchAndRenderPosts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

module.exports.handler = serverless(app);
