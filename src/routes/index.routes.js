import express from 'express';

import * as indexController from '#controllers/index.controller.js';

const router = express.Router();

router.get('/hello-world', indexController.helloWorld);

export default router;
