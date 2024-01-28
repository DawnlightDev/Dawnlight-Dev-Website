const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

function readFiles() {
  const fullPath = path.join(__dirname, '/blog-posts');

  console.log('readFiles function called');

  return new Promise((resolve, reject) => {
    fs.access(fullPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`Directory '${fullPath}' does not have read and write permissions.`);
        console.error('Error:', err);
        reject(err);
      } else {
        console.log(`Directory '${fullPath}' has read and write permissions.`);
        fs.readdir(fullPath, (err, files) => {
          if (err) {
            reject('Error reading directory');
          }
          resolve(files);
        });
      }
    });
  });
}

async function getPosts() {
  try {
    const directoryPath = path.join(__dirname, '/blog-posts'); // Replace with your actual path
    const files = await readFiles(directoryPath);
    const posts = [];

    const promises = files.map(async (file) => {
      if (file.endsWith('.html') && file !== 'mahou-shoujo-monogatari-devlogs.html') {
        const filePath = path.join(directoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const $ = cheerio.load(fileContent);
        const title = $('h1#post-title').text();
        const subtitle = $('h2#post-title').text();
        const content = $('p').text();
        const thumbnailimg = $('img#postimg').attr('src');
        const matchResult = title.match(/\d+/);

        // Check if matchResult is not null before accessing the array element
        const postNumber = matchResult ? parseInt(matchResult[0]) : null;


        const url = `/blog-posts/${file}`;

        // limit the preview to the first 50 words
        const preview = content.split(' ').slice(0, 15).join(' ') + '...';

        // create the HTML markup for each post card
        const postMarkup = `<div class="post-card"><div id="flex-child"><div id="cardimg" style="background-image: url(${thumbnailimg});"></div><h3>${title}</h3><h4>${subtitle}</h4><p>${preview}</p><a href="${url}">Read more</a></div></div>`;

        // add the post data to the posts array
        posts.push({ postNumber, markup: postMarkup });
      }
    });

    await Promise.all(promises);

    // Sort in descending order based on postNumber
    posts.sort((a, b) => b.postNumber - a.postNumber);

    // Example: Print the sorted posts to the console
    console.log(posts);
    return posts;

    // If you want to write the sorted posts to a file, you can use fs.writeFileSync

  }
  
  catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  readFiles,
  getPosts,
};


