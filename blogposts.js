$(document).ready(function() {
  function getPosts() {
    // fetch all the HTML files in the /blog directory
    fetch('/blog-posts')
      .then(response => response.text())
      .then(data => {
        // create an empty array to hold the post data
        var posts = [];

        // parse the HTML data
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(data, 'text/html');

        // get all the links to the HTML files
        var links = htmlDoc.getElementsByTagName('a');

        // loop through the links and fetch the content of each file
        var promises = [];
        for (var i = 0; i < links.length; i++) {
          var link = links[i].getAttribute('href');
          if (link.endsWith('.html')) {
            promises.push(
              (function(link) {
                return fetch(link)
                  .then(response => response.text())
                  .then(postData => {
                    var parser = new DOMParser();
                    var postDoc = parser.parseFromString(postData, 'text/html');
                    var title = postDoc.querySelector('h1#post-title').textContent;
                    var subtitle = postDoc.querySelector('h2#post-title').textContent;
                    var content = postDoc.querySelector('p').textContent;
                    var thumbnailimg = postDoc.querySelector('img#postimg').src;
                    var postNumber = parseInt(title.match(/\d+/)[0]); // Extract the post number
                    console.log(title, content);

                    var url = link;

                    // limit the preview to the first 50 words
                    var preview = content.split(' ').slice(0, 15).join(' ') + '...';

                    // create the HTML markup for each post card
                    var postMarkup = '<div class="post-card">' + '<div id = "flex-child">' +
                      '<div id = "cardimg" style="background-image: url(' + thumbnailimg + ');"></div>' +
                      '<h3>' + title + '</h3>' +
                      '<h4>' + subtitle + '</h4>' +
                      '<p>' + preview + '</p>' +
                      '<a href="' + url + '">Read more</a>' + '</div>' +
                      '</div>';

                    // add the post data to the posts array
                    posts.push({ postNumber: postNumber, markup: postMarkup });
                    console.log(postMarkup);
                  });
              })(link)
            );
          }
        }

        // Wait for all promises to resolve, then sort and update the blog container
        Promise.all(promises).then(() => {
          posts.sort((a, b) => b.postNumber - a.postNumber); // Sort in descending order
          var sortedPostsMarkup = posts.map(post => post.markup);
          $('#devlogs-body').html(sortedPostsMarkup.join(''));
        });
      });
  }

  getPosts();
});
