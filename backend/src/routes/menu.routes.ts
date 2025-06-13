import express from 'express';
import { getMenu } from '../controllers/menu.controller';

const router = express.Router();

router.get('/', getMenu);

export default router;
