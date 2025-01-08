const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const isAsyncAwait = true;

public_users.post("/register", (req,res) => {
  const username = req.query.username; 
  const password = req.query.password; 
  // console.log(username, password);
  if (username && password) { 
    if (!isValid(username)) { 
      users.push({ "username": username, "password": password }); 
      // console.log("User is added --->", users);
      return res.status(200).json({ message: "User successfully registered. Now you can login" }); 
    } else { 
      return res.status(404).json({ message: "User already exists!" }); 
    } 
  } 
  return res.status(404).json({ message: "Unable to register user." }); 
}); 
  
async function getAllBooks(res) {
  try {   
    const allBooks = await JSON.stringify({books}, null, 4);
    // console.log("Get all books ===>", allBooks);
    res.send(allBooks);
  } catch (error) {
    console.error(error.message);
  }
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send a JSON response containing the books array, formatted with an indentation of 4 spaces for readability

  if (isAsyncAwait){
    // Async await
    getAllBooks(res);
  } else {
    // regular code
    res.send(JSON.stringify({books}, null, 4));
  }
});


async function getBookByIsbn(isbn, res) {
  try {   
    var book;
    // find the book
    await Object.keys(books).forEach(x => book = books[x].isbn === isbn ? books[x]: book);
    // Send the book as the response to the client
    res.send(book);
  } catch (error) {
    console.error(error.message);
  }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Extract the isbn parameter from the request URL
  const isbn = req.params.isbn;

  if (isAsyncAwait){
    // Async await
    getBookByIsbn(isbn, res);
  } else {
    var book;
    // find the book
    Object.keys(books).forEach(x => book = books[x].isbn === isbn ? books[x]: book);
    // Send the book as the response to the client
    res.send(book);
  }
 });
  
 async function getBookByAuthor(author, res) {
  try {   
    var book;
    // find the book
    await Object.keys(books).forEach(x => book = books[x].author === author ? books[x]: book);
    // Send the book as the response to the client
    res.send(book);
  } catch (error) {
    console.error(error.message);
  }
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Extract the author parameter from the request URL
  const author = req.params.author;
  if (isAsyncAwait){
    // Async await
    getBookByAuthor(author, res);
  } else {
    var book;
    // find the book
    Object.keys(books).forEach(x => book = books[x].author === author ? books[x]: book);
    // Send the book as the response to the client
    res.send(book);
  }
});

async function getBookByTitle(title, res) {
  try {   
    var book;
    // find the book
    await Object.keys(books).forEach(x => book = books[x].title === title ? books[x]: book);
    // Send the book as the response to the client
    res.send(book);
  } catch (error) {
    console.error(error.message);
  }
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Extract the title parameter from the request URL
  const title = req.params.title;
  if (isAsyncAwait){
    // Async await
    getBookByTitle(title, res);
  } else {
    var book;
    // find the book
    Object.keys(books).forEach(x => book = books[x].title === title ? books[x]: book);
    // Send the book as the response to the client
    res.send(book);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Extract the isbn parameter from the request URL
  const isbn = req.params.isbn;
  var book;
  // find the book
  Object.keys(books).forEach(x => book = books[x].isbn === isbn ? books[x]: book);
  // Send the book as the response to the client
  res.send(book.reviews);
});


module.exports.general = public_users;
