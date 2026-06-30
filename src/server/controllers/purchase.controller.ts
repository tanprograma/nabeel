import { Request, Response } from 'express';
import { PurchaseOrderModel } from '../models/purchase.model';
import { ProductModel } from '../models/product.model';

// ✅ Create a new purchase order
export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const doc = await PurchaseOrderModel.create(req.body);
    const purchaseOrder = await PurchaseOrderModel.findOne({ _id: doc._id });

    await ProductModel.findOneAndUpdate(
      { _id: req.body.item },
      { $inc: { stock: req.body.units }, cost: req.body.total / req.body.units },
      {
        new: true,
      },
    );

    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating purchase order', error });
  }
};

// ✅ Get all purchase orders
export const getPurchaseOrders = async (_req: Request, res: Response) => {
  try {
    const purchaseOrders = await PurchaseOrderModel.find().populate('item').lean();
    res.status(200).json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase orders', error });
  }
};

// ✅ Get a single purchase order by ID
export const getPurchaseOrderById = async (req: Request, res: Response) => {
  try {
    const purchaseOrder = await PurchaseOrderModel.findOne({ _id: req.params['id'] }).lean();
    if (!purchaseOrder) {
      res.status(404).json({ message: 'Purchase order not found' });
    }
    res.status(200).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase order', error });
  }
};

// ✅ Update a purchase order
export const updatePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const updated = await PurchaseOrderModel.findOneAndUpdate({ _id: req.params['id'] }, req.body, {
      new: true,
    }).lean();
    if (!updated) {
      res.status(404).json({ message: 'Purchase order not found' });
    } else {
      await ProductModel.findOneAndUpdate(
        { _id: req.body.item },
        { $inc: { stock: req.body.units } },
        {
          new: true,
        },
      );
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating purchase order', error });
  }
};

// ✅ Delete a purchase order
export const deletePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const deleted = await PurchaseOrderModel.findOneAndDelete({ _id: req.params['id'] }).lean();
    if (!deleted) {
      res.status(404).json({ message: 'Purchase order not found' });
    }
    res.status(200).json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase order', error });
  }
};
