import mongoose, { Schema, Document, Model } from 'mongoose';
import { Product } from '../../app/data/apparel.models';

const ProductSchema: Schema<Product> = new Schema<Product>(
  {
    sku: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    season: { type: String },
    stock: { type: Number, default: 0 },
    reorderPoint: { type: Number, default: 0 },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    supplier: { type: String },
    status: {
      type: String,
      enum: ['Healthy', 'Low stock', 'Critical'],
      default: 'Healthy',
    },
  },
  { timestamps: true },
);

export const ProductModel: Model<Product> =
  mongoose.models['Product'] || mongoose.model<Product>('Product', ProductSchema);
