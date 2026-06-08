import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import {
  inject,
  Injectable,
} from '@angular/core';

import {
  Observable,
} from 'rxjs';

import {
  Product,
} from '../models/product.model';

import {
  ProductsResponse,
} from '../models/products-response.model';

import {
  environment,
} from '../../../environments/environment';

export interface ProductsQuery {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/products`;

  getProducts(
    query: ProductsQuery = {},
  ): Observable<ProductsResponse> {
    const page =
      query.page ?? 1;

    const pageSize =
      query.pageSize ?? 12;

    const skip =
      (page - 1) * pageSize;

    let params =
      new HttpParams()
        .set(
          'limit',
          pageSize,
        )
        .set(
          'skip',
          skip,
        );

    if (query.search) {
      params = params.set(
        'q',
        query.search,
      );
    }

    if (query.sort) {
      const [
        sortField,
        sortDirection,
      ] = query.sort.split('-');

      params = params
        .set(
          'sortBy',
          sortField,
        )
        .set(
          'order',
          sortDirection,
        );
    }

    if (query.search) {
      return this.http.get<ProductsResponse>(
        `${this.apiUrl}/search`,
        {
          params,
        },
      );
    }

    if (query.category) {
      return this.http.get<ProductsResponse>(
        `${this.apiUrl}/category/${encodeURIComponent(query.category)}`,
        {
          params,
        },
      );
    }

    return this.http.get<ProductsResponse>(
      this.apiUrl,
      {
        params,
      },
    );
  }

  getProductById(
    id: string,
  ): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
    );
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/category-list`,
    );
  }
}