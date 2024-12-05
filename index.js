import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: process.env.TOKEN,
  port: 5432,
});
db.connect();

const API_URL = "https://openlibrary.org/dev/docs/api/covers";

//get home page
app.get("/", (req, res) => { 
  res.render("home.ejs");
});

//get about page
app.get("/about", (req, res) => { 
  const API = API_URL;
  res.render("about.ejs", {API : API});
});

app.listen(port, (req, res) => { 
    console.log(`Server is running on http://localhost:${port}`);
});