import { Router } from 'express';
import { getAllUsers, getUserDetails } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getAllUsers);
router.get('/:id', authenticate, authorize(['ADMIN']), getUserDetails);

export default router;
