const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require('mongodb');
const utils = require('./src/utils.js')
require("dotenv").config({ path: path.resolve(__dirname, '.env') })

const portNumber = process.argv[2] || 5000;

app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`)

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${username}:${password}@cluster0.4yqidsx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();

app.get("/", (_, response) => {
    response.render("index");
});

app.post("/images", async (request, response) => {
    memes = utils.generateRandomMemes(6)

    response.render("images")
})

app.use((_, response) => {
    response.status(404).send("Resource not found");
});
