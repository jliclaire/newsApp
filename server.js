const express = require("express");
const path = require("path");
const Twitter = require("twitter");
// const fetch = require("node-fetch");
// const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(express.static("style"));
app.use(express.json());
// app.use(cors());

//require schema
const News = require("./models/News");

const port = 3300;

// db authentication
const mongoPROD_URI = process.env.MONGO_PROD_URI;

mongoose
  .connect(mongoPROD_URI, { useNewUrlParser: true }, err => {
    if (err) return console.log(err);
  })
  .then(console.log("connected to mongodb"));

// GET request
app.get("/collection", async (req, res) => {
  try {
    const allArticles = await News.find().sort({ _id: -1 });
    return res.json(allArticles);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

//POST request
app.post("/news", async (req, res) => {
  try {
    const { image, sourceName, title, description, url, date } = req.body;
    const newArticle = await News.create({
      image,
      sourceName,
      title,
      description,
      url,
      date
    });
    return res.json(newArticle);
  } catch (error) {
    return res.json(error);
  }
});

//POST
//send article to Twitter
const client = new Twitter({
  consumer_key: "SXXcoJ7nUdorWHiPnqwQNHjaR",
  consumer_secret: "R1F3xPTNFxZaweBdyQUSSMacyeD4zCEY0gF9TYFbyxklVXIbbB",
  access_token_key: "1043798051670773760-3LMsPTl3BVJVSx9jeKfswVI1Dl7EqT",
  access_token_secret: "qCaIxaY6bvSLEQDNYJSOMQktxxjMHRz5BIH5ndyvW3baY"
});

const params = { screen_name: "nodejs" };

app.post("/twitter", async (req, res) => {
  try {
    const { url } = req.body;
    console.log(url);
    console.log("inside twitter route");
    await client.post("statuses/update", { status: url }, function(
      error,
      source,
      response
    ) {
      if (error) console.log(error.message);
      console.log(source); // Tweet body.
      console.log(response); // Raw response object.
    });
  } catch (error) {
    return res.json(error);
  }
});

//DELETE request
app.delete("/news/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const findArticle = await News.findOneAndDelete({ title });
    if (!findArticle) {
      return res.send(`No article found`);
    }
    return res.send(`${findArticle.title} deleted from database`);
  } catch (err) {
    return res.json(err.message);
  }
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
