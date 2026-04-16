const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(404).json({ message: "Username and/or password are missing" });
    if (!isValid(username))
        return res.status(404).json({ message: `User ${username} already exists!` });

    users.push({ username, password });
    return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    return res.status(200).json(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const { isbn } = req.params;
    let book = books[isbn];
    if (!book)
        return res.status(208).json({ message: "Unable to find book" });
    return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let { author } = req.params;
    let authorBook = {};
    for (let key in books) {
        if (books[key].author === author) {
            authorBook = books[key];
            break;
        }
    }
    if (!authorBook)
        return res.status(208).json({ message: "Unable to find book" });
    
    return res.status(200).json(authorBook);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let { title } = req.params;
    let titleBook = {};
    for (let key in books) {
        if (books[key].title === title) {
            titleBook = books[key];
            break;
        }
    }
    if (!titleBook)
        return res.status(208).json({ message: "Unable to find book" });
    
    return res.status(200).json(titleBook);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const { isbn } = req.params;
    let book = books[isbn];
    if (!book)
        return res.status(208).json({ message: "Unable to find book" });
    return res.status(200).json(book.reviews);
});

/**
 * Asynchronous section
 */
public_users.get('/async', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const { isbn } = req.params;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Unable to find book" });
    }
});

public_users.get('/async/author/:author', async function (req, res) {
    try {
        const { author } = req.params;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Unable to find book" });
    }
});

public_users.get('/async/title/:title', async function (req, res) {
    try {
        const { title } = req.params;
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Unable to find book" });
    }
});
/**
 * Asynchronous section
 */

module.exports.general = public_users;
