import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'sales',
    renderMode: RenderMode.Client,
  },
  {
    path: 'reports',
    renderMode: RenderMode.Client,
  },
  {
    path: 'detailed-reports',
    renderMode: RenderMode.Client,
  },
  {
    path: 'purchasing',
    renderMode: RenderMode.Client,
  },
  {
    path: 'inventory',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
