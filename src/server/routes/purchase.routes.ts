import express from 'express';
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from '../controllers/purchase.controller';

const router = express.Router();

// ✅ Create a new purchase order
router.post('/', createPurchaseOrder);

// ✅ Get all purchase orders
router.get('/', getPurchaseOrders);

// ✅ Get a single purchase order by ID
router.get('/:id', getPurchaseOrderById);

// ✅ Update a purchase order
router.put('/:id', updatePurchaseOrder);

// ✅ Delete a purchase order
router.delete('/:id', deletePurchaseOrder);

export default router;
