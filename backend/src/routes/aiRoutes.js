import express from 'express';
import { analyzeWithAi } from '../controllers/aiController.js';

const router = express.Router();

router.post('/performance', analyzeWithAi);

export default router;
