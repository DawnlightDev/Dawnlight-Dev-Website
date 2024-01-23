$(document).ready(function() {
  function getPosts() {
    // fetch all the HTML files in the /blog-posts/ directory from the server
    fetch('blog-posts')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        // create an empty array to hold the post data
        var posts = [];

        // loop through the files and fetch the content of each file
        var promises = data.files.map(file => {
          return fetch(`/blog-posts/${file}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error fetching post ${file}: ${response.status} - ${response.statusText}`);
              }
              return response.text();
            })
            .then(postData => {
              var parser = new DOMParser();
              var postDoc = parser.parseFromString(postData, 'text/html');
              var title = postDoc.querySelector('h1#post-title').textContent;
              var subtitle = postDoc.querySelector('h2#post-title').textContent;
              var content = postDoc.querySelector('p').textContent;
              var thumbnailimg = postDoc.querySelector('img#postimg').src;
              var postNumber = parseInt(title.match(/\d+/)[0]); // Extract the post number

              var url = `/blog-posts/${file}`;

              // limit the preview to the first 50 words
              var preview = content.split(' ').slice(0, 15).join(' ') + '...';

              // create the HTML markup for each post card
              var postMarkup = '<div class="post-card">' + '<div id="flex-child">' +
                '<div id="cardimg" style="background-image: url(' + thumbnailimg + ');"></div>' +
                '<h3>' + title + '</h3>' +
                '<h4>' + subtitle + '</h4>' +
                '<p>' + preview + '</p>' +
                '<a href="' + url + '">Read more</a>' + '</div>' +
                '</div>';

              // add the post data to the posts array
              posts.push({ postNumber: postNumber, markup: postMarkup });
            })
            .catch(error => {
              console.error(error);
            });
        });

        // Wait for all promises to resolve, then sort and update the blog container
        Promise.all(promises).then(() => {
          posts.sort((a, b) => b.postNumber - a.postNumber); // Sort in descending order
          var sortedPostsMarkup = posts.map(post => post.markup);
          $('#devlogs-body').html(sortedPostsMarkup.join(''));
        });
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
      });
  }

  getPosts();
});
