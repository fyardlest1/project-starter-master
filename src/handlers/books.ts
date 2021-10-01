import express, { Request, Response } from 'express';
import { Book, BookStore } from '../models/book'

const store = new BookStore()

// Express handler function
// Get the book list
const index = async (req: Request, res: Response) => {
    const books = await store.index()
    res.json(books)
}

// Get book by id
const show = async (req: Request, res: Response) => {
	const book = await store.show(req.body.id)
	res.json(book)
}

// Post a new book
const create = async (req: Request, res: Response) => {
	try {
        const book: Book = {
			id: req.body.id,
			title: req.body.title,
			author: req.body.author,
			totalPages: req.body.totalPages,
			summary: req.body.summary,
		}

		const newBook = await store.create(book)
		res.json(newBook)
	} catch (err) {
		res.status(400)
		res.json(err)
	}
}

// Delete a book by id
const destroy = async (req: Request, res: Response) => {
	const deleted = await store.delete(req.body.id)
	res.json(deleted)
}

// Creating access to all the express methods
const bookRoutes = (app: express.Application) => {
    app.get('/books', index)
    app.get('/books/:id', show)
	app.post('/books', create)
	app.delete('/books', destroy)
}

export default bookRoutes