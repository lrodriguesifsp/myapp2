import pool from '#config/database.js';

export const create = async ({ content, userId }) => {
	const [result] = await pool.execute(
		'INSERT INTO posts (content, userId) VALUES (?, ?)',
		[content, userId,]
	);
	return result.insertId;
};

export const index = async ({ page = 1, limit = 10 }) => {
	const offset = (page - 1) * limit;
	const [rows] = await pool.query(
		`SELECT p.id, p.content, p.createdAt, u.username
         FROM posts p
         INNER JOIN users u ON p.userId = u.id
         ORDER BY p.createdAt DESC
         LIMIT ? OFFSET ?`,
		[limit, offset]
	);
	return rows;
};

export const count = async () => {
	const [rows] = await pool.execute(
		'SELECT COUNT(*) as count FROM posts'
	);
	return rows[0].count;
};
