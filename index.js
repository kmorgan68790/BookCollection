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
    bookList = [];
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

//get add book page
app.get("/add", (req, res) => { 
  res.render("add.ejs");
});

//post add book
app.post("/add", async (req, res) => {
const { title, isbn, date, rating, link, summary, notes } = req.body;
const bookCover = `https://covers.openlibrary.org/b/ISBN/${req.params.isbn}-M.jpg`;

try{
  await db.query("INSERT INTO books (book_cover, title, isbn, date_read, rating, book_link, summary) VALUES ($1, $2, $3, $4, $5, $6, $7)", [bookCover, title,  isbn, date, rating, link, summary]);
  const book = await db.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
  await db.query("INSERT INTO notes (note, book_id) VALUES ($1, $2)", [notes, book.rows[0].id]);
  res.redirect("/");  
} catch (err) { 
  console.log(err);
  res.render("add.ejs", {error: "There was an error adding the book"});
}
});

//get update book page
// app.get("/book/:id/update", async(req, res) => { 
//   const id = req.params.id;
  
//   try {
//     const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
//     res.render("update.ejs", {book: result.rows[0]});
//   } catch (err) { 
//     console.log(err);
//     res.render("update.ejs", {error: "There was an error updating the book"});
//   }
// });
app.get("/book/:id/update", (req, res) => { 
  let book = null;
  const id = parseInt(req.params.id);
  book = bookList.find((p) => p.id == id);
  if (book) {
    res.render("update.ejs", { book });
  } else {
    res.status(404).send("Book not found");
  }
});

//post update book
app.post("/book/:id/update", async (req, res) => { 
  const id = req.params.id;
  const { title, isbn, date, rating, link, summary } = req.body;
  const bookCover = `https://covers.openlibrary.org/b/ISBN/${req.params.isbn}-M.jpg`;

  let book = bookList.find((p) => p.id == id);
  console.log(bookList );
  console.log(book);

  book.title = title;
  book.isbn = isbn;
  book.date = date;
  book.rating = rating;
  book.link = link;
  book.summary = summary;
  book.bookCover = bookCover;

  try {
    await db.query("UPDATE books SET book_cover = $1, title = $2, isbn = $3, date_read = $4, rating = $5, book_link = $6, summary = $7 WHERE id = $8", [bookCover, title, isbn, date, rating, link, summary, id]);
    res.redirect(`/book/${id}`);
  } catch (err) { 
    console.log(err);
    res.render("update.ejs", {error: "There was an error updating the book"});
  }
});

//get delete book page
app.post("/book/:id/delete", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM notes WHERE book_id = $1", [id]);
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) { 
    console.log(err);
    res.render("delete.ejs", {error: "There was an error deleting the book"});
  }
});

app.listen(port, (req, res) => { 
    console.log(`Server is running on http://localhost:${port}`);
});