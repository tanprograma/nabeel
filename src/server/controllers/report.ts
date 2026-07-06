import { Request, Response } from 'express';
import { SaleOrderModel } from '../models/sale.model';
import { ProductModel } from '../models/product.model';

// ✅ Create a new sale order
export const findDetailedReport = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;

    const [sales, products] = await Promise.all([
      SaleOrderModel.find({
        createdAt: { $gte: new Date(start as string), $lte: new Date(end as string) },
      })
        .populate('item')
        .lean(),

      ProductModel.find().lean(),
    ]);

    const data = sales.map((sale) => {
      const { name, stock, cost, price } = products.find(
        (p) => p._id.toString() === sale.item._id.toString(),
      ) as any;
      const { units, total } = sale;
      const revenue = total;
      const availableUnits = stock;

      const margin = total - cost * units;
      return {
        item: name,
        availableUnits,
        cost,
        price,
        units,
        revenue,
        totalCost: cost * units,
        margin,
      };
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sale order', error });
  }
};
export const rawReport = async (req: Request, res: Response) => {
  try {
    const [sales, products] = await Promise.all([
      SaleOrderModel.find().populate('item').lean(),

      ProductModel.find().lean(),
    ]);

    const data = sales.map((sale) => {
      const { name, stock, cost, price } = products.find(
        (p) => p._id.toString() === sale.item._id.toString(),
      ) as any;
      const { units, total } = sale;
      const revenue = total;
      const availableUnits = stock;

      const margin = total - cost * units;
      return {
        item: name,
        availableUnits,
        cost,
        price,
        units,
        revenue,
        totalCost: cost * units,
        margin,
      };
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sale order', error });
  }
};
function toObjects(items: any[]) {
  return items.map((item) => item.toObject());
}
