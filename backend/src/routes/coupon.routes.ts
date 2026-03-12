import { Router } from 'express';
import { validateCoupon, getAllCoupons, createCoupon, deleteCoupon } from '../controllers/coupon.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getAllCoupons);
router.post('/', authenticate, authorize(['ADMIN']), createCoupon);
router.post('/validate', authenticate, validateCoupon);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteCoupon);

export default router;
