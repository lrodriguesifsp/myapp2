import * as Post from '../models/postModel.js';

export const create = async (req, res, next) => {
	const { content } = req.body;
	const userId = req.user.id;

	if (!content?.trim()) {
		return res.status(400).json({ message: 'Content is required' });
	}

	await Post.create({ content, userId });

	res.status(201).json({ message: 'Post created' });
};

export const index = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	const posts = await Post.index({ page, limit });
	const totalPosts = await Post.count();

	res.json({
		posts,
		totalPages: Math.ceil(totalPosts / limit),
		currentPage: page,
	});
};
