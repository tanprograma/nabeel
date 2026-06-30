import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { ApparelStoreService } from './data/apparel-store.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(ApparelStoreService);

  protected readonly navItems = [
    { label: 'Dashboard', note: 'Snapshot', route: '/dashboard' },
    { label: 'Inventory', note: 'SKUs and stock', route: '/inventory' },
    { label: 'Purchasing', note: 'Receipts and suppliers', route: '/purchasing' },
    { label: 'Sales', note: 'Orders and channels', route: '/sales' },
    { label: 'Reports', note: 'Trends and alerts', route: '/reports' },
  ];

  protected readonly facts = computed(() => [
    { label: 'Products', value: String(this.store.products().length) },
    { label: 'Low stock', value: String(this.store.lowStockProducts().length) },
    { label: 'Revenue', value: this.store.formatMoney(this.store.revenue()) },
  ]);
}
