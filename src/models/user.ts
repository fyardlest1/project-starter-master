import Client from '../database'
import bcrypt from 'bcrypt'

export type User = {
	id?: number
	username: string
	password: string
}

export class UserStore {
	// GET all the books
	async index(): Promise<User[]> {
		try {
			// @ts-ignore
			const conn = await Client.connect()
			const sql = 'SELECT * FROM users'
			const result = await conn.query(sql)

			conn.release()

			return result.rows
		} catch (err) {
			throw new Error(`Could not get user list. Error: ${err}`)
		}
	}

	// GET a user by id
	async show(id: string): Promise<User> {
		try {
			const sql = 'SELECT * FROM users WHERE id=($1)'
			// @ts-ignore
			const conn = await Client.connect()
			const result = await conn.query(sql, [id])

			conn.release()

			return result.rows[0]
		} catch (err) {
			throw new Error(`Could not find user ${id}. Error: ${err}`)
		}
	}

	// POST (CREATE/ADD) a user to the database
	async create(u: User): Promise<User> {
		try {
			// @ts-ignore
			const conn = await Client.connect()
			const sql =
				'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *'

			const salt = process.env.SALT_ROUNDS || ''
			const pepper = process.env.BCRYPT_PASSWORD || ''
			const hash = bcrypt.hashSync(
				u.password + pepper,
				parseInt(salt)
			)

			const result = await conn.query(sql, [u.username, hash])
			const user = result.rows[0]

			conn.release()

			return user
		} catch (err) {
			throw new Error(`unable create user (${u.username}): ${err}`)
		}
	}

	// Authenticate user to the database (Get)
	async authenticate(
		username: string,
		password: string
	): Promise<User | null> {
		const conn = await Client.connect()
		const sql = 'SELECT password_digest FROM users WHERE username=($1)'

		const result = await conn.query(sql, [username])

		const pepper = process.env.BCRYPT_PASSWORD || ''
		console.log(password + pepper)

		if (result.rows.length) {
			const user = result.rows[0]

			console.log(user)

			if (bcrypt.compareSync(password + pepper, user.password_digest)) {
				return user
			}
		}

		return null
	}

	// DELETE a user by id
	async delete(id: string): Promise<User> {
		try {
			const sql = 'DELETE FROM users WHERE id=($1)'
			// @ts-ignore
			const conn = await Client.connect()
			const result = await conn.query(sql, [id])

			const book = result.rows[0]

			conn.release()

			return book
		} catch (err) {
			throw new Error(`Could not delete book ${id}. Error: ${err}`)
		}
	}
}