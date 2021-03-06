import express, { Request, Response, NextFunction } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const store = new UserStore()

// Custom Express middleware
const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authorizationHeader = req.headers.authorization as string
		const token = authorizationHeader.split(' ')[1]
		const secret = process.env.TOKEN_SECRET
		const decoded = jwt.verify(token, secret as jwt.Secret)

		next()
	} catch (error) {
		res.status(401)
	}
}

// Get the user list
const index = async (req: Request, res: Response) => {
    const users = await store.index()
    res.json(users)
}

// Get user by id
const show = async (req: Request, res: Response) => {
	const user = await store.show(req.body.id)
	res.json(user)
}

// POST request
const create = async (req: Request, res: Response) => {
	const user: User = {
		username: req.body.username,
		password: req.body.password,
	}
	try {
		const newUser = await store.create(user)
		const secret = process.env.TOKEN_SECRET
		let token = jwt.sign({ user: newUser }, secret as jwt.Secret)
		res.json(token)
	} catch (err) {
		res.status(400)
		res.json(err + user)
	}
}

// Get access
const authenticate = async (req: Request, res: Response) => {
	const user: User = {
		username: req.body.username,
		password: req.body.password,
	}
	try {
		const customer = await store.authenticate(user.username, user.password)
		const secret = process.env.TOKEN_SECRET
		let token = jwt.sign({ user: customer }, secret as jwt.Secret)
		res.json(token)
	} catch (err) {
		res.status(401)
		res.json({ err })
	}
}

const update = async (req: Request, res: Response) => {
	const user: User = {
		id: parseInt(req.params.id),
		username: req.body.username,
		password: req.body.password,
	}
	try {
		const authorizationHeader = req.headers.authorization as string
		const token = authorizationHeader.split(' ')[1]
		const secret = process.env.TOKEN_SECRET
		const decoded = jwt.verify(token, secret as jwt.Secret)
		if (decoded.id !== user.id) {
			throw new Error('User id does not match!')
		}
	} catch (err) {
		res.status(401)
		res.json(err)
		return
	}

	try {
		const updated = await store.create(user)
		res.json(updated)
	} catch (err) {
		res.status(400)
		res.json(err + user)
	}
}

// Delete request
const destroy = async (req: Request, res: Response) => {
	try {
		const authorizationHeader = req.headers.authorization as string
		const token = authorizationHeader.split(' ')[1]
		const secret = process.env.TOKEN_SECRET
		jwt.verify(token, secret as jwt.Secret)
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

const userRoutes = (app: express.Application) => {
	app.get('/users', index)
	app.get('/users/:id', show)
	app.post('/users', verifyAuthToken, create)
	app.put('/users/:id', verifyAuthToken, update)
	app.delete('/users/:id', verifyAuthToken, destroy)
}

export default userRoutes