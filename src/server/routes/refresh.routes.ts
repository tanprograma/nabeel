import express from 'express';
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from '../controllers/purchase.controller';
import { refresh } from '../controllers/refresh.controller';

const router = express.Router();

// ✅ Get all purchase orders
router.get('/', refresh);

export default router;
