import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
	const authHeader = req.headers['authorization'];

	let token = null;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		token = authHeader.split(' ')[1];
	} else if (req.cookies && req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		throw createError(401, 'Token não fornecido');
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		throw createError(401, 'Token inválido');
	}
};