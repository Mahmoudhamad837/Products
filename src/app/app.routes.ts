import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout').then(
        (m) => m.MainLayout,
      ),
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then(
            (m) => m.PRODUCTS_ROUTES,
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layouts/auth-layout/auth-layout').then(
        (m) => m.AuthLayout,
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(
            (m) => m.authRoutes,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];