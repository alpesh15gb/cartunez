import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getWishlist);
router.post('/', authenticate, addToWishlist);
router.delete('/:id', authenticate, removeFromWishlist);

export default router;
