import {
  CurrencyPipe,
  DecimalPipe,
} from '@angular/common';

import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';

import {
  catchError,
  EMPTY,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs';

import {
  ProductsApiService,
} from '../../services/products-api.service';

import {
  Product,
} from '../../models/product.model';

import {
  Button,
} from '../../../../shared/components/button/button';

@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink,
    CurrencyPipe,
    DecimalPipe,
    Button,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly productsApi =
    inject(ProductsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  protected readonly product =
    signal<Product | null>(null);

  protected readonly selectedImage =
    signal<string | null>(null);

  protected readonly quantity =
    signal(1);

  protected readonly errorMessage =
    signal<string | null>(null);

  protected readonly isOutOfStock =
    computed(() => {
      const currentProduct = this.product();

      return (
        !currentProduct ||
        currentProduct.stock <= 0 ||
        currentProduct.availabilityStatus ===
        'Out Of Stock'
      );
    });

  protected readonly discountedPrice =
    computed(() => {
      const currentProduct = this.product();

      if (!currentProduct) {
        return 0;
      }

      const discount =
        currentProduct.discountPercentage / 100;

      return (
        currentProduct.price -
        currentProduct.price * discount
      );
    });

  protected readonly displayedImage =
    computed(() => {
      const currentProduct = this.product();

      return (
        this.selectedImage() ??
        currentProduct?.thumbnail ??
        ''
      );
    });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),

        tap(() => {
          this.errorMessage.set(null);
          this.product.set(null);
          this.selectedImage.set(null);
          this.quantity.set(1);
        }),

        switchMap((id) => {
          if (!id) {
            this.errorMessage.set(
              'Product ID is missing.',
            );

            return EMPTY;
          }

          return this.productsApi
            .getProductById(id)
            .pipe(
              tap((product) => {
                this.product.set(product);

                this.selectedImage.set(
                  product.images[0] ??
                  product.thumbnail,
                );
              }),

              catchError((error: unknown) => {
                console.error(
                  'Failed to load product:',
                  error,
                );

                this.errorMessage.set(
                  'Unable to load this product. It may not exist.',
                );

                return EMPTY;
              })
            );
        }),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected selectImage(
    imageUrl: string,
  ): void {
    this.selectedImage.set(imageUrl);
  }

  protected increaseQuantity(): void {
    const currentProduct = this.product();

    if (
      !currentProduct ||
      this.quantity() >= currentProduct.stock
    ) {
      return;
    }

    this.quantity.update(
      (currentQuantity) =>
        currentQuantity + 1,
    );
  }

  protected decreaseQuantity(): void {
    if (this.quantity() <= 1) {
      return;
    }

    this.quantity.update(
      (currentQuantity) =>
        currentQuantity - 1,
    );
  }

  protected addProductToCart(): void {
    const currentProduct = this.product();

    if (
      !currentProduct ||
      this.isOutOfStock()
    ) {
      return;
    }

    console.log(
      'Add product to cart:',
      {
        product: currentProduct,
        quantity: this.quantity(),
      },
    );
  }
}