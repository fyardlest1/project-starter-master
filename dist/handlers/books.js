"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const book_1 = require("../models/book");
const store = new book_1.BookStore();
// Express handler function
// Get the book list
const index = async (req, res) => {
    const books = await store.index();
    res.json(books);
};
// Get book by id
const show = async (req, res) => {
    const book = await store.show(req.body.id);
    res.json(book);
};
// Post a new book
const create = async (req, res) => {
    try {
        const book = {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
            totalPages: req.body.totalPages,
            summary: req.body.summary,
        };
        const newBook = await store.create(book);
        res.json(newBook);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
// Delete a book by id
const destroy = async (req, res) => {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
};
// Creating access to all the express methods
const bookRoutes = (app) => {
    app.get('/books', index);
    app.get('/books/:id', show);
    app.post('/books', create);
    app.delete('/books', destroy);
};
exports.default = bookRoutes;
