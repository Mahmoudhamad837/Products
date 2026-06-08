export interface Product {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price: number;
  discountPercentage: number;
  rating?: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  availabilityStatus?: string;
  shippingInformation?: string;
  warrantyInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images: string[];
  thumbnail?: string;
  reviews?: Review[];
}

export interface Review {
    comment: string;
    date: string;
    rating: number;
    reviewerEmail: string;
    reviewerName: string;
}