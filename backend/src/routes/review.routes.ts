import { Router } from 'express';
import { createReview, getProductReviews } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/:productId', getProductReviews);

export default router;
