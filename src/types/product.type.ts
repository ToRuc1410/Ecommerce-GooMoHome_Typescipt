export interface Product {
  _id: string
  images: string[]
  price: number
  rating?: number
  price_before_discount: number
  quantity: number
  sold?: number
  view?: number
  name: string
  height: number
  length: number
  weight: number
  width: number
  descriptionHTML: string
  detailProductHTML: string
  category: {
    _id: string
    name: string
  }
  image: string
  createdAt: string
  updatedAt: string
}
export interface ProductList {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
export interface ProductConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  // rating_filter?: number | string
  price_min?: number | string
  price_max?: number | string
  name?: string
  category?: string
}
