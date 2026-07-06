import mongoose from 'mongoose';

export interface Product {
  _id: string;
  sku: string;
  name: string;
  category: string;
  season: string;
  stock: number;
  reorderPoint: number;
  cost: number;
  price: number;
  supplier: string;
  status: 'Healthy' | 'Low stock' | 'Critical';
}

export interface PurchaseOrder {
  _id: mongoose.Types.ObjectId;
  supplier: string;
  item: mongoose.Types.ObjectId;
  units: number;
  total: number;
  status: 'Ordered' | 'In transit' | 'Received';
  orderedOn: string;
}

export interface SaleOrder {
  _id: mongoose.Types.ObjectId;
  channel: 'Retail' | 'Online' | 'Wholesale';
  item: mongoose.Types.ObjectId;
  units: number;
  total: number;
  state: 'Paid' | 'Pending' | 'Returned';
  soldOn: string;
}

export interface CategoryBreakdown {
  category: string;
  units: number;
  share: number;
}

export interface ChannelBreakdown {
  channel: SaleOrder['channel'];
  total: number;
  share: number;
}

export interface NewProductInput {
  sku: string;
  name: string;
  category: string;
  season: string;
  stock: number;
  reorderPoint: number;
  cost: number;
  price: number;
  supplier: string;
}

export interface NewPurchaseInput {
  productId: string;
  supplier: string;
  units: number;
  costPerUnit: number;
  status: PurchaseOrder['status'];
  orderedOn: string;
}

export interface NewSaleInput {
  productId: string;
  channel: SaleOrder['channel'];
  units: number;
  pricePerUnit: number;
  state: SaleOrder['state'];
  soldOn: string;
}

export interface ApparelSnapshot {
  products: Product[];
  purchases: PurchaseOrder[];
  sales: SaleOrder[];
}

export interface ApparelSummary {
  revenue: number;
  purchaseSpend: number;
  inventoryValue: number;
  totalUnits: number;
  lowStockCount: number;
  sellThroughRate: number;
  estimatedMargin: number;
}
export interface DetailedReportData {
  item: string;
  price: number;
  cost: number;
  units: number;
  stock: number;
  revenue: number;
  totalCost: number;
  margin: number;
}
