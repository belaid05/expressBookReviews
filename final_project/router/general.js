const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const API_BASE_URL = "http://localhost:5000";


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.some(user => user.username === username)) {
  return res.status(409).json({ message: "Username already exists" });
}

users.push({ username, password });

  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookList = Object.values(books).filter(book => book.author === author);
  if (bookList.length === 0) {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json(bookList);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookList = Object.values(books).filter(book => book.title === title);
  if (bookList.length === 0) {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json(bookList);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json(book.reviews);
});

async function getAllBooks() {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data;
}

async function getBookByISBN(isbn) {
  const response = await axios.get(
    `${API_BASE_URL}/isbn/${encodeURIComponent(isbn)}`
  );
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await axios.get(
    `${API_BASE_URL}/author/${encodeURIComponent(author)}`
  );
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await axios.get(
    `${API_BASE_URL}/title/${encodeURIComponent(title)}`
  );
  return response.data;
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
