import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';

import { ApparelStoreService } from '../../data/apparel-store.service';

@Component({
  selector: 'app-reports-page',
  imports: [CurrencyPipe, PercentPipe],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPage {
  protected readonly store = inject(ApparelStoreService);
}
