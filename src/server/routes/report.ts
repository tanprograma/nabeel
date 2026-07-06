import express from 'express';
import { findDetailedReport, rawReport } from '../controllers/report';

const router = express.Router();

// ✅ Get all purchase orders
router.get('/', findDetailedReport);
router.get('/raw', rawReport);

export default router;
