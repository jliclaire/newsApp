const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    image: String,
    sourceName: String,
    title: String,
    description: String,
    url: String,
    date: String
  },
  { collection: "news" }
);

module.exports = mongoose.model("news", newsSchema);
