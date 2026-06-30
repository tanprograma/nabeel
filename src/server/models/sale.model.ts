import mongoose, { Schema, Document, Model } from 'mongoose';
import { SaleOrder } from '../../app/data/apparel.models';

const SaleOrderSchema: Schema<SaleOrder> = new Schema<SaleOrder>(
  {
    channel: {
      type: String,
      enum: ['Retail', 'Online', 'Wholesale'],
      required: true,
    },
    item: { type: Schema.Types.ObjectId, ref: 'Product' },
    units: { type: Number, required: true },
    total: { type: Number, required: true },
    state: {
      type: String,
      enum: ['Paid', 'Pending', 'Returned'],
      default: 'Paid',
    },
    soldOn: { type: String, required: true },
  },
  { timestamps: true },
);

export const SaleOrderModel: Model<SaleOrder> =
  mongoose.models['SaleOrder'] || mongoose.model<SaleOrder>('SaleOrder', SaleOrderSchema);
