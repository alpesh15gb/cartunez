import { Router } from 'express';
import { createProduct, getProducts, getProductById } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN']), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
