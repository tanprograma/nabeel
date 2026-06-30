import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page').then((module) => module.DashboardPage),
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./pages/inventory-page/inventory-page').then((module) => module.InventoryPage),
  },
  {
    path: 'purchasing',
    loadComponent: () =>
      import('./pages/purchasing-page/purchasing-page').then((module) => module.PurchasingPage),
  },
  {
    path: 'sales',
    loadComponent: () => import('./pages/sales-page/sales-page').then((module) => module.SalesPage),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports-page/reports-page').then((module) => module.ReportsPage),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
