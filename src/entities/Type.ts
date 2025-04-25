import { Category } from "./Category";
import { Product } from "./Product";

export type Type = {
  _id?: string;
  description: string;
  price: number;
  stock?: number;
  visibilityStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  product: Product;
};

export type TypeDoc = {
  _id: string;
  description: string;
};
