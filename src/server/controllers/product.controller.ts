import { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';

// ✅ Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

// ✅ Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find().lean();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// ✅ Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findOne({ _id: req.params['id'] }).lean();
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// ✅ Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updated = await ProductModel.findOneAndUpdate({ _id: req.params['id'] }, req.body, {
      new: true,
    }).lean();
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};
export const restockProduct = async (req: Request, res: Response) => {
  try {
    const updated = await ProductModel.findOneAndUpdate(
      { _id: req.params['id'] },
      { $inc: { stock: req.body.units } },
      {
        new: true,
      },
    ).lean();
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};

// ✅ Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await ProductModel.findOneAndDelete({ _id: req.params['id'] }).lean();
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
