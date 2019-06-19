const express = require("express");
const path = require("path");
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

const port = 3000;

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
    const allArticles = await News.find();
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

//DELETE request
app.delete("/news/:title", async (req, res) => {
  try {
    console.log(req.params);
    const { title } = req.params;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@" + title);
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
