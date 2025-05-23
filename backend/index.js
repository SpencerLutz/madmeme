const path = require("path");
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const utils = require("./src/utils.js");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const portNumber = process.argv[2] || process.env.NODE_PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "static")));

app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`);

const db_name = "madmeme";
const coll_name = "memes";

let mongoUri = "";
if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
  mongoUri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
} else {
  mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
}
const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect();

app.get("/ping", (_, response) => {
  response.render(".");
});

app.get("/", (_, response) => {
  response.render("index");
});

app.post("/images", async (request, response) => {
  top = request.body.top;
  bottom = request.body.bottom;
  urls = await utils.generateRandomMemes(top, bottom, 6);
  ids = [];
  for (url of urls) {
    id = utils.generateId();
    ids.push(id);
    client.db(db_name).collection(coll_name).insertOne({
      id: id,
      url: url,
      created: new Date(),
    });
  }
  db_urls = ids.map((id) => `https://madmeme.levilutz.com/meme/${id}`);
  response.render("images", { urls: urls, db_urls: db_urls });
});

app.get("/meme/:id", async (request, response) => {
  id = request.params.id;
  client
    .db(db_name)
    .collection(coll_name)
    .findOne({ id: id })
    .then((res) => {
      if (res) {
        response.render("meme", { url: res.url });
      } else {
        response.render("notfound");
      }
    });
});

app.use((_, response) => {
  response.status(404).send("Resource not found");
});
