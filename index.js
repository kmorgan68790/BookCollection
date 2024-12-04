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

app.addListener(port, (req, res) => { 
    console.log(`Server is running on http://localhost:${port}`);
});