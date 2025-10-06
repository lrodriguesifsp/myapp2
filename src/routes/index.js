import express from 'express';
import { helloWorld } from '../controllers/indexController.js';

const router = express.Router();

router.post('/hello', helloWorld);

export default router;
