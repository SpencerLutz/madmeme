const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require('mongodb');
const utils = require('./src/utils.js')
require("dotenv").config({ path: path.resolve(__dirname, '.env') })
require('express-async-errors');

const portNumber = process.argv[2] || 5000;

app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`)

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db_name = 'madmeme'
const coll_name = 'memes'

const uri = `mongodb+srv://${username}:${password}@cluster0.4yqidsx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();

app.get("/", (_, response) => {
    response.render("index");
});

app.post("/images", async (request, response) => {
    top = request.body.top
    bottom = request.body.bottom
    urls = await utils.generateRandomMemes(top, bottom, 6)
    ids = []
    for (url of urls) {
        id = utils.generateId()
        ids.push(id)
        client.db(db_name).collection(coll_name).insertOne({
            id: id,
            url: url
        })
    }
    db_urls = ids.map(id => `http://madmeme.sites-admin.com/meme/${id}`)
    response.render("images", {urls: urls, db_urls: db_urls})
})

app.get("/meme/:id", async (request, response) => {
    id = request.params.id
    client.db(db_name).collection(coll_name).findOne({id: id}).then((res) => {
        if (res) {
            response.render("meme", {url: res.url})
        } else {
            response.render("notfound")
        }
    })
})

app.use((_, response) => {
    response.status(404).send("Resource not found");
});
