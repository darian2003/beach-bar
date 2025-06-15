import express from 'express';
import { validateToken } from '../controllers/tokenController';

const router = express.Router();

router.get('/validate-token/:token', validateToken);

export default router; 