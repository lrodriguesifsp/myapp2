import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	
	let token;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		token = authHeader.split(' ')[1];
	} else if (req.cookies && req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		return next(createError(401, 'Authentication token not found.'));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return next(createError(401, 'Invalid token'));
	}
};
