import express from 'express';
import {
  createSaleOrder,
  getSaleOrders,
  getSaleOrderById,
  updateSaleOrder,
  deleteSaleOrder,
} from '../controllers/sale.controller';

const router = express.Router();

// ✅ Create a new sale order
router.post('/', createSaleOrder);

// ✅ Get all sale orders
router.get('/', getSaleOrders);

// ✅ Get a single sale order by _id
router.get('/:id', getSaleOrderById);

// ✅ Update a sale order
router.put('/:id', updateSaleOrder);

// ✅ Delete a sale order
router.delete('/:id', deleteSaleOrder);

export default router;
