import * as postModel from '#models/post.model.js';

export const create = async (req, res, next) => {
	const { content } = req.body;
	const userId = req.user.id;

	if (!content) {
		throw createError(400, 'Todos os campos são obrigatórios');
	}

	await postModel.create({ content, userId });

	res.status(201).json({ message: 'Postagem publicada com sucesso' });
};

export const index = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	const posts = await postModel.index({ page, limit });
	const totalPosts = await postModel.count();

	res.json({
		posts,
		totalPages: Math.ceil(totalPosts / limit),
		currentPage: page

	});
};
