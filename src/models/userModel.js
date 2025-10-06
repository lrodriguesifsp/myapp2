import db from '../config/mysql2.js';

// Busca usuário por username
export const findUserByUsername = async (username) => {
	const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
	return rows.length > 0 ? rows[0] : null;
};

// Verifica se username já está em uso
export const isUsernameTaken = async (username) => {
	const [rows] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
	return rows.length > 0;
};

// Cria novo usuário no banco
export const createUser = async ({ name, username, email, password }) => {
	const [result] = await db.execute(
		'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)',
		[name, username, email, password]
	);
	return result.insertId;
};
