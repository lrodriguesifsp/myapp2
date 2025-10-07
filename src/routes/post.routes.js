import express from 'express';

import * as postController from '#controllers/post.controller.js';

import { authenticate } from '#middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, postController.create);
router.get('/', postController.index);

export default router;
