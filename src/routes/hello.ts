import { Router } from 'express';
import { HelloController } from '../controllers/HelloController';

const router = Router();

// Hello World endpoint
router.get('/hello', HelloController.hello);

// Health check endpoint
router.get('/health', HelloController.health);

export default router; 