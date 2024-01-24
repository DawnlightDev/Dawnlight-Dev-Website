const express = require('express');
const path = require('path');
const blogPosts = require('./blogposts.js');
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

blogPosts.readFiles('/blog-posts').then(posts => {
    console.log(posts);
    // Do something with the posts
  })
  .catch(error => {
    console.error('Error:', error);
  });

blogPosts.getPosts();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
