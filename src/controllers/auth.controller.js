import bcrypt from 'bcrypt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import ms from 'ms';

import * as userModel from '#models/user.model.js';

export const register = async (req, res, next) => {
	const { name, username, password, email } = req.body;

	if (!name || !username || !password || !email) {
		throw createError(400, 'Todos os campos são obrigatórios');
	}

	const isAvailable = await userModel.isUsernameAvailable(username);
	if (!isAvailable) {
		throw createError(409, 'O nome de usuário já está em uso');
	}

	const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	await userModel.create({ name, username, email, password: hashedPassword });

	res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
};

export const login = async (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password) {
		throw createError(400, 'Usuário e senha são obrigatórios');
	}

	const user = await userModel.findByUsername(username);
	if (!user) {
		throw createError(401, 'Usuário ou senha inválidos');
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw createError(401, 'Usuário ou senha inválidos');
	}

	const token = jwt.sign(
		{ id: user.id, username: user.username },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN,
		}
	);

	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: ms(process.env.JWT_EXPIRES_IN)
	});

	res.json({ message: 'Login realizado com sucesso', token });
};

export const logout = (req, res) => {
	res.clearCookie('token');
	res.json({ message: 'Logout realizado com sucesso' });
};