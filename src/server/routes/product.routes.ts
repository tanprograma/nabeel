import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restockProduct,
} from '../controllers/product.controller';

const router = express.Router();

// ✅ Create a new product
router.post('/', createProduct);

// ✅ Get all products
router.get('/', getProducts);

// ✅ Get a single product by ID
router.get('/:id', getProductById);

// ✅ Update a product
router.put('/:id', updateProduct);
router.put('/:id/restock', restockProduct);

// ✅ Delete a product
router.delete('/:id', deleteProduct);

export default router;
