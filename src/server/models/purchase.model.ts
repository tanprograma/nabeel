import mongoose, { Schema, Document, Model } from 'mongoose';
import { PurchaseOrder } from '../../app/data/apparel.models';

const PurchaseOrderSchema: Schema<PurchaseOrder> = new Schema<PurchaseOrder>(
  {
    supplier: { type: String, required: true },
    item: { type: Schema.Types.ObjectId, ref: 'Product' },
    units: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Ordered', 'In transit', 'Received'],
      default: 'Received',
    },
    orderedOn: { type: String, required: true },
  },
  { timestamps: true },
);

// ✅ Use existing model if already compiled
export const PurchaseOrderModel: Model<PurchaseOrder> =
  mongoose.models['PurchaseOrder'] ||
  mongoose.model<PurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
