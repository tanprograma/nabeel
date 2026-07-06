import { Router } from 'express';
import purchaseRoutes from './purchase.routes';
import saleRoutes from './sale.routes';
import productRoutes from './product.routes';
import refreshRoutes from './refresh.routes';
import detailedReportRoutes from './report';

const router = Router();
router.use('/purchases', purchaseRoutes);
router.use('/sales', saleRoutes);
router.use('/products', productRoutes);
router.use('/refresh', refreshRoutes);
router.use('/detailed-report', detailedReportRoutes);

export default router;
