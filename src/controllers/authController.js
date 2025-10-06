import bcrypt from 'bcrypt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { findUserByUsername, isUsernameTaken, createUser } from '../models/userModel.js';

// Registrar usuário
export const register = async (req, res, next) => {
	const { name, username, password, email } = req.body;

	if (!name || !username || !email || !password)
		return next(createError(400, 'Missing required fields'));

	if (await isUsernameTaken(username)) return next(createError(400, 'User already exists'));

	const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	await createUser({ name, username, email, password: hashedPassword });

	res.status(201).json({ message: 'User created' });
};

// Login
export const login = async (req, res, next) => {
	const { username, password } = req.body;

	const user = await findUserByUsername(username);
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return next(createError(401, 'Invalid username or password'));
	}

	const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
	});

	res.json({ message: 'Login successful', token: token });
};

// Logout
export const logout = (req, res) => {
	res.json({ message: 'Logout successful' });
};
