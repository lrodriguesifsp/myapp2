import express from 'express';
import { create, index } from '../controllers/postController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, create);
router.get('/', index);

export default router;
