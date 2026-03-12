import { Router } from 'express';
import { getMakes, getModelsByMake, getYearsByModel } from '../controllers/vehicle.controller';

const router = Router();

router.get('/makes', getMakes);
router.get('/makes/:makeId/models', getModelsByMake);
router.get('/models/:modelId/years', getYearsByModel);

export default router;
