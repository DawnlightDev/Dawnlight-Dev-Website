document.addEventListener('DOMContentLoaded', function () {
    fetch('https://dawnlight.dev/blog-posts')
        .then(response => response.json())
        .then(posts => {
            const devlogsBody = document.getElementById('devlogs-body');
          posts.forEach(post => {
                const postMarkup = `
                    <div class="post-card">
                        <div id = "video"><iframe>Yt Url</iframe>
                        <h3>${post.title}</h3>
                        <h4>${post.subtitle}</h4>
                        <p>${post.preview}</p>
                        <a href = ${post.url}>Read More</a>
                    </div>
                `;
                devlogsBody.insertAdjacentHTML('beforeend', postMarkup);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
});
