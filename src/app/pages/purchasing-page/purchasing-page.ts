import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApparelStoreService } from '../../data/apparel-store.service';
import { NewPurchaseInput } from '../../data/apparel.models';

@Component({
  selector: 'app-purchasing-page',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, JsonPipe],
  templateUrl: './purchasing-page.html',
  styleUrl: './purchasing-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasingPage {
  protected readonly store = inject(ApparelStoreService);
  protected readonly message = signal<string | null>(null);
  protected readonly today = new Date().toISOString().slice(0, 10);
  private readonly fb = inject(FormBuilder);

  readonly purchaseForm = this.fb.nonNullable.group({
    productId: ['', [Validators.required]],
    supplier: ['North Looms'],
    units: [1, [Validators.required, Validators.min(1)]],
    costPerUnit: [1, [Validators.required, Validators.min(1)]],
    status: ['Received'],
    orderedOn: [this.today, [Validators.required]],
  });

  submitPurchase(): void {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      return;
    }

    this.store.recordPurchase(this.getPurchasePayload());

    this.message.set('Purchase recorded and inventory has been replenished.');
    this.purchaseForm.patchValue({
      units: 1,
      costPerUnit: 1,
      status: 'Ordered',
      orderedOn: this.today,
    });
  }
  getPurchasePayload() {
    const data: any = this.purchaseForm.getRawValue() as NewPurchaseInput;
    let payload: any = {};
    for (let key of Object.keys(data)) {
      if (key == 'costPerUnit') {
        payload['total'] = data['units'] * data[key];
      } else if (key == 'productId') {
        payload['item'] = data[key];
      } else {
        payload[key] = data[key];
      }
    }
    return payload;
  }
}
