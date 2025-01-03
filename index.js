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
let bookList = [];

//get home page
app.get("/", async (req, res) => { 
  try {
    const result = await db.query("SELECT * FROM books;");
    const apiResult = await axios.get(API_URL);
    // const isbnResult = await db.query("SELECT isbn FROM books WHERE id =", result.rows.id);
    let bookList = [];
    result.rows.forEach(book => {
      bookList.push(book);
    });
    console.log(result.rows);

  console.log(bookList);
    res.render("home.ejs", {books: bookList}); 
  } catch (err) { 
    console.log(err);
    res.render("home.ejs", {error: "There are currently no books to view"});
  }
});

//get single book page
app.get("/book/:id", async (req, res) => { 
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    const notesResult = await db.query("SELECT note FROM notes WHERE book_id = $1", [id]);
    console.log(result.rows[0]);
    console.log(notesResult.rows[0]);
    res.render("book.ejs", {book: result.rows[0], note : notesResult.rows[0]}); 
  } catch (err) { 
    console.log(err);
    res.render("book.ejs", { error: "There are currently no books to view" });
  }
});

//get edit 
app.get("/edit", async (req, res) => {
 res.render("edit.ejs");
});

//get about page
app.get("/about", (req, res) => { 
  const API = API_URL;
  res.render("about.ejs", {API : API});
});

//get contact
app.get("/contact", (req,res) => {
  res.render("contact.ejs");
});

app.listen(port, (req, res) => { 
    console.log(`Server is running on http://localhost:${port}`);
});