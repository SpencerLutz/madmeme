const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: path.resolve(__dirname, '.env') })

const portNumber = process.argv[2] || 5000;

app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`)

const uri = `fill in mongodb here`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();

app.get("/", (request, response) => {
    response.render("index");
});

app.use((_, response) => {
    response.status(404).send("Resource not found");
});
