const fs = require('fs');
const path = require('path');

function getPosts() {
  const blogDirectory = './blog-posts/';

  // Read the contents of the blog directory
  fs.readdir(blogDirectory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Create an empty array to hold the post data
    var posts = [];

    // Loop through each file in the directory
    files.forEach(file => {
      if (file.endsWith('.html')) {
        const filePath = path.join(blogDirectory, file);
        
        // Read the content of each HTML file
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading file:', err);
            return;
          }

          // Parse the HTML data
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(data, 'text/html');

          // Extract post information
          const title = htmlDoc.querySelector('h1#post-title').textContent;
          const subtitle = htmlDoc.querySelector('h2#post-title').textContent;
          const content = htmlDoc.querySelector('p').textContent;
          const thumbnailimg = htmlDoc.querySelector("img#postimg").src;

          // Limit the preview to the first 50 words
          const preview = content.split(' ').slice(0, 15).join(' ') + '...';

          const url = filePath; // Use file path as URL

          // Create HTML markup for each post card
          const postMarkup = '<div class="post-card">' +
            '<img id="cardimg" src="' + thumbnailimg + '">' +
            '<h3>' + title + '</h3>' +
            '<h4>' + subtitle + '</h4>' +
            '<p>' + preview + '</p>' +
            '<a href="' + url + '">Read more</a>' +
            '</div>';

          // Add the post data to the posts array
          posts.push(postMarkup);

          // If all files have been processed, append posts to the element
          if (posts.length === files.length) {
            // Append the posts to the 'home-body' element
            $('#devlogs-body').html(posts.join(''));
          }
        });
      }
    });
  });
}

getPosts();
