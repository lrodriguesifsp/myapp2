import 'dotenv/config';

import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';

const __dirname = import.meta.dirname;

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// Not Found handler
app.use((req, res, next) => {
	next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';

	if (process.env.NODE_ENV === 'development') {
		console.error(err.stack);
	}

	res.status(status).json({ message });
});

// Start server
app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
