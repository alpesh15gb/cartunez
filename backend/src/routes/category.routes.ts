import { Router } from 'express';
import { createCategory, getCategories } from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN']), createCategory);
router.get('/', getCategories);

export default router;
