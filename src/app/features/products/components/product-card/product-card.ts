import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import {
  CurrencyPipe,
  DecimalPipe,
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { Product } from '../../models/product.model';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-product-card',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    Button
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();

  readonly addToCart = output<Product>();

  protected readonly reviewCount = computed(() => {
    return this.product().reviews?.length || 0;
  });

  protected addProductToCart(): void {
    if (!this.product().availabilityStatus || this.product().availabilityStatus === 'Out Of Stock') {
      return;
    }

    this.addToCart.emit(this.product());
  }
}