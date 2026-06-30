import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApparelStoreService } from '../../data/apparel-store.service';
import { NewSaleInput, Product } from '../../data/apparel.models';

@Component({
  selector: 'app-sales-page',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './sales-page.html',
  styleUrl: './sales-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesPage {
  protected readonly store = inject(ApparelStoreService);
  protected readonly message = signal<string | null>(null);
  protected readonly today = new Date().toISOString().slice(0, 10);
  private readonly fb = inject(FormBuilder);

  readonly saleForm = this.fb.nonNullable.group({
    productId: ['', [Validators.required]],
    channel: ['Retail'],
    units: [4, [Validators.required, Validators.min(1)]],
    pricePerUnit: [59, [Validators.required, Validators.min(1)]],
    state: ['Paid'],
    soldOn: [this.today, [Validators.required]],
  });

  get selectedProduct() {
    const productId = String(this.saleForm.controls.productId.value);

    return this.store.getProduct(productId);
  }
  selectProduct() {
    const productId = String(this.saleForm.controls.productId.value);
    console.log(productId);
    if (!productId) throw new Error('product value is invalid');
    return this.store.getProduct(productId);
  }
  prefillPrice() {
    console.log('event fired');
    try {
      const product = this.selectProduct() as Product;

      this.saleForm.patchValue({ pricePerUnit: product.price });
    } catch (error) {
      console.log(' error occurred..');
    }
  }
  submitSale(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    this.store.recordSale(this.getSalePayload() as NewSaleInput);

    this.message.set('Purchase recorded and inventory has been replenished.');

    this.message.set('Sale recorded and stock updated.');
    this.saleForm.patchValue({
      units: 4,
      pricePerUnit: this.selectedProduct?.price ?? 59,
      state: 'Paid',
      soldOn: this.today,
    });
  }

  getSalePayload() {
    const data: any = this.saleForm.getRawValue() as NewSaleInput;
    let payload: any = {};
    for (let key of Object.keys(data)) {
      if (key == 'pricePerUnit') {
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
