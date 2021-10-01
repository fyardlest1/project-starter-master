import express, { Request, Response } from 'express';
import { Book, BookStore } from '../models/book'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

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

// Post a new book (with authentication)
const create = async (req: Request, res: Response) => {
	try {
		const authorizationHeader = req.headers.authorization
		const token = authorizationHeader.split(' ')[1]
		jwt.verify(token, process.env.TOKEN_SECRET)
	} catch (err) {
		res.status(401)
		res.json('Access denied, invalid token')
		return
	}

	try {
		const book: Book = {
			title: req.body.title,
			author: req.body.author,
			totalPages: req.body.total_pages,
			summary: req.body.summary,
		}

		const newBook = await store.create(book)
		res.json(newBook)
	} catch (err) {
		res.status(400)
		res.json(err)
	}
}

// Delete a book by id (with authentication)
const destroy = async (req: Request, res: Response) => {
	try {
		const authorizationHeader = req.headers.authorization
		const token = authorizationHeader.split(' ')[1]
		jwt.verify(token, process.env.TOKEN_SECRET)
	} catch (err) {
		res.status(401)
		res.json('Access denied, invalid token')
		return
	}

	try {
		const deleted = await store.delete(req.body.id)
		res.json(deleted)
	} catch (error) {
		res.status(400)
		res.json({ error })
	}
}

// Creating access to all the express methods
const bookRoutes = (app: express.Application) => {
    app.get('/books', index)
    app.get('/books/:id', show)
	app.post('/books', create)
	app.delete('/books', destroy)
}

export default bookRoutes