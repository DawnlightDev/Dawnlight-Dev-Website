$(document).ready(function() {
  function getPosts() {
    // fetch all the HTML files in the /blog directory
    fetch('/blog/')
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
        for (var i = 0; i < links.length; i++) {
          var link = links[i].getAttribute('href');
          if (link.endsWith('.html')) {
            fetch(link)
              .then(response => response.text())
              .then(postData => {
                var parser = new DOMParser();
                var postDoc = parser.parseFromString(postData, 'text/html');
                var title = postDoc.querySelector('h1#post-title').textContent;
                var content = postDoc.querySelector('p').textContent;
                console.log(title, content);

                var url = link;

                // limit the preview to the first 50 words
                var preview = content.split(' ').slice(0, 15).join(' ') + '...';

                // create the HTML markup for each post card
                var postMarkup = '<div class="post-card">' +
                                  '<h3>' + title + '</h3>' +
                                  '<p>' + preview + '</p>' +
                                  '<a href="' + url + '">Read more</a>' +
                                  '</div>';

                // add the post data to the posts array
                posts.push(postMarkup);

                // add the post cards to the blog container element
                $('#blog').html(posts.join(''));
              });
          }
        }
      });
  }
  
  getPosts();
});
