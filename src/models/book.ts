// @ts-ignore
import Client from '../database'

export type Book = {
	id: number
	title: string
	author: string
	totalPages: number
	summary: string
}

export class BookStore {
    // GET all the books
	async index(): Promise<Book[]> {
		try {
			// @ts-ignore
			const conn = await Client.connect()
			const sql = 'SELECT * FROM books'
			const result = await conn.query(sql)

			conn.release()

			return result.rows
		} catch (err) {
			throw new Error(`Could not get books. Error: ${err}`)
		}
	}

    // GET a book by id
	async show(id: string): Promise<Book> {
		try {
			const sql = 'SELECT * FROM books WHERE id=($1)'
			// @ts-ignore
			const conn = await Client.connect()
			const result = await conn.query(sql, [id])

			conn.release()

			return result.rows[0]
		} catch (err) {
			throw new Error(`Could not find book ${id}. Error: ${err}`)
		}
	}

    // POST (CREATE/ADD) a book in the database 
	async create(b: Book): Promise<Book> {
		try {
			const sql =
				'INSERT INTO books (title, author, total_pages, summary) VALUES($1, $2, $3, $4) RETURNING *'
			// @ts-ignore
			const conn = await Client.connect()
			const result = await conn.query(sql, [
				b.title,
				b.author,
				b.totalPages,
				b.summary,
			])

			const book = result.rows[0]

			conn.release()

			return book
		} catch (err) {
			throw new Error(`Could not add new book ${b.title}. Error: ${err}`)
		}
	}

    // DELETE a book by id
	async delete(id: string): Promise<Book> {
		try {
			const sql = 'DELETE FROM books WHERE id=($1)'
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
