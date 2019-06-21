//load top headlines articles when the page loaded
async function getTopHeadlines() {
  await fetch(
    "https://newsapi.org/v2/top-headlines?country=us&apiKey=6249bfd8aa4246198cc38b472f829078"
  )
    .then(res => {
      return res.json();
    })
    .then(data => {
      const articles = data.articles;
      const showNews = document.querySelector(".show-news");
      articles.forEach(article => {
        let output = `
    <div class="row">
      <div class="image-col"><img class="image" src="${article.urlToImage}">
      </div>
      <div class="content">
        <div class="title">${article.title}</div>
        <div class="date">${article.publishedAt.slice(0, 10)}</div>
        <div class="source-name">Source: ${article.source.name}</div>
        <div class="description">${article.description}</div>
        <a class="url" href="${article.url}" target="_blank">Read More</a>
        <div class="icon">
          <div class="far-star">
            <i class="far fa-star" onclick="saveArticle(this)"></i>
          </div>
          <div class="tweet-icon">
            <a href="https://twitter.com/JINGLI11074891" target="_blank" class="tweet"><i class="fab fa-twitter" onclick="sendTweet(this)"></i>Tweet This</a>
          </div>
        </div>
      </div>
    </div>
    `;
        showNews.insertAdjacentHTML("beforeend", output);
      });
    });
}

getTopHeadlines();

// async calls to POST data to API endpoint
const getData = (image, date, sourceName, title, description, url) => {
  return {
    image,
    date,
    sourceName,
    title,
    description,
    url
  };
};

//save an article to collection database
const saveArticle = async source => {
  const parentDiv =
    source.parentElement.parentElement.parentElement.parentElement;

  //toggle star icon
  parentDiv.querySelector(".fa-star").classList.toggle("star-color");

  //get data from each element
  let image = parentDiv.querySelector(".image").getAttribute("src");
  let date = parentDiv.querySelector(".date").innerText;
  let sourceName = parentDiv.querySelector(".source-name").innerText;
  let title = parentDiv.querySelector(".title").innerText;
  let description = parentDiv.querySelector(".description").innerText;
  let url = parentDiv.querySelector(".url").getAttribute("href");

  const data = getData(image, date, sourceName, title, description, url);
  const response = await axios.post("/news", data);
};

//sent tweet to server then to twitter
const sendTweet = async source => {
  const parentDiv =
    source.parentElement.parentElement.parentElement.parentElement;

  //toggle star icon
  parentDiv.querySelector(".tweet").innerText = "tweeted";

  //get data from each element
  // let image = parentDiv.querySelector(".image").getAttribute("src");
  // let date = parentDiv.querySelector(".date").innerText;
  // let sourceName = parentDiv.querySelector(".source-name").innerText;
  // let title = parentDiv.querySelector(".title").innerText;
  // let description = parentDiv.querySelector(".description").innerText;
  let url = parentDiv.querySelector(".url").getAttribute("href");
  console.log(url);
  // const data = getData(image, date, sourceName, title, description, url);
  await axios.post("/twitter", { url });
};
