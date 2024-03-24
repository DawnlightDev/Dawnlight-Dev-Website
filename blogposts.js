$(document).ready(function() {
    fetch('https://dawnlight.dev/blog-posts')
        .then(response => response.json())
        .then(posts => {
            const devlogsBody = $('#devlogs-body');
            posts.forEach(post => {
                const postMarkup = `
                    <div class="post-card">
                        <div id="video">${post.content}</div>
                        <h3>${post.title}</h3>
                        <h4>${post.subtitle}</h4>
                        <p>${post.preview}</p>
                        <a href="${post.url}">Read More</a>
                    </div>
                `;
                devlogsBody.append(postMarkup);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
});
