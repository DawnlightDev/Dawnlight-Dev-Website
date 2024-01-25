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

app.get('/sub', async (req, res) => {
  
  try {
    const posts = await blogPosts.readFiles('/blog-posts');
    console.log(posts);
    const allPosts = blogPosts.getPosts();
    console.log(allPosts);
    res.sendFile(path.join(__dirname, '/sub/mahou-shoujo-monogatari-devlogs.html'));
    console.log("Posts updated!");
  }
  
  catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
