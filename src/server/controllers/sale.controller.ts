import { Request, Response } from 'express';
import { SaleOrderModel } from '../models/sale.model';
import { ProductModel } from '../models/product.model';

// ✅ Create a new sale order
export const createSaleOrder = async (req: Request, res: Response) => {
  try {
    const doc = await SaleOrderModel.create(req.body);
    const saleOrder = await SaleOrderModel.findOne({ _id: doc._id });
    const product = await ProductModel.findOneAndUpdate(
      { _id: req.body.item },
      { $inc: { stock: -req.body.units } },
      {
        new: true,
      },
    );
    res.status(201).json({ ...saleOrder?.toObject(), item: { name: product?.name } });
  } catch (error) {
    res.status(400).json({ message: 'Error creating sale order', error });
  }
};

// ✅ Get all sale orders
export const getSaleOrders = async (_req: Request, res: Response) => {
  try {
    const saleOrders = await SaleOrderModel.find().populate('item').lean();
    res.status(200).json(saleOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale orders', error });
  }
};

// ✅ Get a single sale order by MongoDB _id
export const getSaleOrderById = async (req: Request, res: Response) => {
  try {
    const saleOrder = await SaleOrderModel.findOne({ _id: req.params['id'] }).lean();
    if (!saleOrder) {
      res.status(404).json({ message: 'Sale order not found' });
    }
    res.status(200).json(saleOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale order', error });
  }
};

// ✅ Update a sale order
export const updateSaleOrder = async (req: Request, res: Response) => {
  try {
    const updated = await SaleOrderModel.findOneAndUpdate({ _id: req.params['id'] }, req.body, {
      new: true,
    }).lean();
    if (!updated) {
      res.status(404).json({ message: 'Sale order not found' });
    } else {
      await ProductModel.findOneAndUpdate(
        { _id: req.body.item },
        { $inc: { stock: -req.body.units } },
        {
          new: true,
        },
      );
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating sale order', error });
  }
};

// ✅ Delete a sale order
export const deleteSaleOrder = async (req: Request, res: Response) => {
  try {
    const deleted = await SaleOrderModel.findOneAndDelete({ _id: req.params['id'] }).lean();
    if (!deleted) {
      res.status(404).json({ message: 'Sale order not found' });
    }
    res.status(200).json({ message: 'Sale order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale order', error });
  }
};
