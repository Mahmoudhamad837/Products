import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

import {
  Product,
} from '../../models/product.model';

import {
  ProductFilters,
} from '../../models/product-filter.model';

import {
  ProductsApiService,
  ProductsQuery,
} from '../../services/products-api.service';

import {
  ProductCard,
} from '../../components/product-card/product-card';

import {
  ProductFilter,
} from '../../components/product-filter/product-filter';

import {
  Pagination,
} from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductCard,
    ProductFilter,
    Pagination,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList
  implements OnInit {
  private readonly productsApi =
    inject(ProductsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  protected readonly products =
    signal<Product[]>([]);

  protected readonly categories =
    signal<string[]>([]);

  protected readonly totalItems =
    signal(0);

  protected readonly query =
    signal<ProductsQuery>({
      page: 1,
      pageSize: 12,
    });

  protected readonly errorMessage =
    signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  protected applyFilters(
    filters: ProductFilters,
  ): void {
    this.query.update(
      (
        currentQuery,
      ) => ({
        ...currentQuery,
        ...filters,
        page: 1,
      }),
    );

    this.loadProducts();
  }

  protected changePage(
    page: number,
  ): void {
    this.query.update(
      (
        currentQuery,
      ) => ({
        ...currentQuery,
        page,
      }),
    );

    this.loadProducts();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  protected loadCategories(): void {
    this.productsApi
      .getAllCategories()
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe({
        next: (
          categories,
        ) => {
          this.categories.set(
            categories,
          );
        },

        error: (
          error: unknown,
        ) => {
          console.error(
            'Failed to load categories:',
            error,
          );
        },
      });
  }

  protected loadProducts(): void {
    this.errorMessage.set(null);

    this.productsApi
      .getProducts(
        this.query(),
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe({
        next: (
          response,
        ) => {
          this.products.set(
            response.products,
          );

          this.totalItems.set(
            response.total,
          );
        },

        error: (
          error: unknown,
        ) => {
          console.error(
            'Failed to load products:',
            error,
          );

          this.errorMessage.set(
            'Unable to load products. Please try again.',
          );
        },
      });
  }

  protected addToCart(
    product: Product,
  ): void {
    console.log(
      'Add product to cart:',
      product,
    );
  }
}