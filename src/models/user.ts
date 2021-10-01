import Client from '../database'
import bcrypt from 'bcrypt'

export type User = {
	id: number
	username: string
	password: string
}

export class UserStore {
	// POST (CREATE/ADD) a user to the database
	async create(u: User): Promise<User> {
		try {
			// @ts-ignore
			const conn = await Client.connect()
			const sql =
				'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *'

			const hash = bcrypt.hashSync(
				u.password + pepper,
				parseInt(saltRounds)
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
}