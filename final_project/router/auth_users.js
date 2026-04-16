const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    return users.filter(user => user.username === username).length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.filter(user => user.username === username && user.password === password).length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(404).json({ message: "Username and/or password are missing" });
    if (!authenticatedUser(username, password))
        return res.status(208).json({ message: "Invalid Login. Check username and password" });

    // Generate JWT access token
    let authToken = jwt.sign({
        data: username
    }, 'jwtSecret', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
        authToken, username
    }
    return res.status(200).json({message: "User successfully logged in"});
});

// Add/modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const { isbn } = req.params;
    const { review } = req.query;

    if (!review)
        return res.status(404).json({message: "Unable to add review."});

    const { username } = req.session.authorization;
    let { reviews } = books[isbn];
    reviews[username] = review;
    books[isbn].reviews = reviews;

    return res.status(200).json({message: "Review added successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const { isbn } = req.params;

    const { username } = req.session.authorization;
    let { reviews } = books[isbn];
    delete reviews[username];
    books[isbn].reviews = reviews;

    return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
