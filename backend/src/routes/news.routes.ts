import { Router } from 'express';
import { createNews, getAllNews, deleteNews, updateNews } from '../controllers/news.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getAllNews);
router.post('/', authenticate, authorize(['ADMIN']), createNews);
router.put('/:id', authenticate, authorize(['ADMIN']), updateNews);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteNews);

export default router;
