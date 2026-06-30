import { InjectionToken } from '@angular/core';

export const BACKEND_SYNC_ENABLED = new InjectionToken<boolean>('BACKEND_SYNC_ENABLED', {
  providedIn: 'root',
  factory: () => false,
});
