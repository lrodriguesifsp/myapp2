import pool from '#config/database.js';

export const create = async ({ name, username, email, password }) => {
	const [result] = await pool.execute(
		'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)',
		[name, username, email, password]
	);
	return result.insertId;
};

export const isUsernameAvailable = async (username) => {
	const [rows] = await pool.execute(
		'SELECT id FROM users WHERE username = ?',
		[username]
	);
	return rows.length === 0;
};

export const findByUsername = async (username) => {
	const [rows] = await pool.execute(
		'SELECT * FROM users WHERE username = ?',
		[username]
	);
	return rows[0];
};