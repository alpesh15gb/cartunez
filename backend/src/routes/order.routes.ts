import { Router } from 'express';
import { 
    createOrder, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus, 
    getOrderById,
    requestReturn,
    handleReturnAction
} from '../controllers/order.controller';
import { verifyPayment } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { handleRazorpayWebhook } from '../controllers/webhook.controller';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/all', authenticate, authorize(['ADMIN']), getAllOrders);
router.get('/:id', getOrderById);
router.post('/verify-payment', authenticate, verifyPayment);
router.post('/webhook/razorpay', handleRazorpayWebhook);
router.patch('/:id/status', authenticate, authorize(['ADMIN']), updateOrderStatus);

// Return Management
router.post('/:id/return', authenticate, requestReturn);
router.patch('/:id/return-action', authenticate, authorize(['ADMIN']), handleReturnAction);

export default router;
