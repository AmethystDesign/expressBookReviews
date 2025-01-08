const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user) => { 
    return user.username === username; 
  }); 
  return userswithsamename.length > 0; 
}

// Function to check if the user is authenticated 
const authenticatedUser = (username, password) => { 
  // console.log("Checking Authenticate User --->", username, password)
  // console.log(users);
  let validusers = users.filter((user) => { 
    return user.username === username && user.password === password; 
  }); 
  return validusers.length > 0; 
}; 


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username; 
  const password = req.query.password; 
  // console.log(username, password);
  if (!username || !password) { 
    return res.status(404).json({ message: "Error logging in" }); 
  } 
  if (authenticatedUser(username, password)) { 
    // console.log("User exists");
    // Generate JWT access token
    let accessToken = jwt.sign({ 
      data: password 
      }, 'access', { expiresIn: 60 * 60 }); 
    
      // console.log("Set authorization --->");
    // Store access token in session
    req.session.authorization = { 
      accessToken, 
      username 
    }; 
    return res.status(200).send("User successfully logged in"); 
  } else { 
      return res.status(208).json({ message: "Invalid Login. Check username and password" }); 
  } 
}); 

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Extract the isbn parameter from the request URL
  const isbn = req.params.isbn;
  // console.log("Put Review ===>", req.query);
  var book;
  // find the book
  Object.keys(books).forEach(x => book = books[x].isbn === isbn ? books[x]: book);

  username = req.session.authorization.username;

  let reviews = book.reviews;
  // console.log("Reviews before updating --->", username, reviews, req.params.review);
  reviews[username] = req.query.review;
  book.reviews = reviews;

  // Send the book as the response to the client
  // console.log("Reviews after updating --->", reviews, book.reviews);
  res.send(book.reviews); 
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract the isbn parameter from the request URL
    const isbn = req.params.isbn;
    // console.log("Delete Review ===>", req.query);
    var book;
    // find the book
    Object.keys(books).forEach(x => book = books[x].isbn === isbn ? books[x]: book);
  
    username = req.session.authorization.username;
  
    let Reviews = book.reviews;
    // console.log("Reviews before updating --->", username, reviews, req.params.review);
    delete Reviews[username];
    book.reviews = Reviews;
  
    // Send the book as the response to the client
    // console.log("Reviews after updating --->", reviews, book.reviews);
    res.send(book.reviews); 
  });
  


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
