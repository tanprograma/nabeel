import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';

import { ApparelStoreService } from '../../data/apparel-store.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [CurrencyPipe, DatePipe, PercentPipe],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly store = inject(ApparelStoreService);
  ngOnInit() {
    this.store.refreshFromBackend();
  }
}
