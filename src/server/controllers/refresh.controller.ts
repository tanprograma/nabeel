import { Request, Response } from 'express';
import { SaleOrderModel } from '../models/sale.model';
import { ProductModel } from '../models/product.model';
import { PurchaseOrderModel } from '../models/purchase.model';

// ✅ Create a new sale order
export const refresh = async (req: Request, res: Response) => {
  try {
    const [sales, purchases, products] = await Promise.all([
      SaleOrderModel.find().populate('item').lean(),
      PurchaseOrderModel.find().populate('item').lean(),
      ProductModel.find().lean(),
    ]);
    res.status(201).json({ sales, purchases, products });
  } catch (error) {
    res.status(400).json({ message: 'Error creating sale order', error });
  }
};
