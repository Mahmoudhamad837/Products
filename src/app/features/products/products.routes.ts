import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list').then(
        (m) => m.ProductList,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/product-details/product-details').then(
        (m) => m.ProductDetails,
      ),
  },
];