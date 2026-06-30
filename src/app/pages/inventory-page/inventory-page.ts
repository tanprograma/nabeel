import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApparelStoreService } from '../../data/apparel-store.service';
import { NewProductInput } from '../../data/apparel.models';

@Component({
  selector: 'app-inventory-page',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryPage {
  protected readonly store = inject(ApparelStoreService);
  protected readonly message = signal<string | null>(null);
  private readonly fb = inject(FormBuilder);

  readonly addProductForm = this.fb.nonNullable.group({
    sku: ['AT-'],
    name: [''],
    category: ['Shirts'],
    season: ['Core'],
    stock: [12, [Validators.required, Validators.min(0)]],
    reorderPoint: [10, [Validators.required, Validators.min(0)]],
    cost: [24, [Validators.required, Validators.min(1)]],
    price: [59, [Validators.required, Validators.min(1)]],
    supplier: ['North Looms'],
  });

  readonly restockForm = this.fb.nonNullable.group({
    productId: ['', [Validators.required]],
    units: [8, [Validators.required, Validators.min(1)]],
  });

  addProduct(): void {
    if (this.addProductForm.invalid) {
      this.addProductForm.markAllAsTouched();
      return;
    }

    this.store.addProduct(this.addProductForm.getRawValue() as NewProductInput);
    this.message.set('Product added to the assortment.');
    this.addProductForm.reset({
      sku: 'AT-',
      name: '',
      category: 'Shirts',
      season: 'Core',
      stock: 12,
      reorderPoint: 10,
      cost: 24,
      price: 59,
      supplier: 'North Looms',
    });
  }

  restockProduct(): void {
    if (this.restockForm.invalid) {
      this.restockForm.markAllAsTouched();
      return;
    }

    const { productId, units } = this.restockForm.getRawValue();

    this.store.restockProduct(productId, units);
    this.message.set('Stock has been replenished and logged as a receipt.');
    this.restockForm.patchValue({ units: 8 });
  }
}
