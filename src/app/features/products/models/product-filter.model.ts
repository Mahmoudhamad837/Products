export type ProductSort = 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';

export interface ProductFilters {
  search: string;
  category: string;
  sort?: string;
}

export interface ProductsQuery extends ProductFilters {
  page: number;
  pageSize: number;
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  search: '',
  category: '',
};

export const DEFAULT_PRODUCTS_QUERY: ProductsQuery = {
  ...DEFAULT_PRODUCT_FILTERS,
  page: 1,
  pageSize: 12,
};