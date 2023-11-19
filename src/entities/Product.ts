import { Category } from "./Category";

export type Price = {
  description: string;
  price: number;
};

export type Product = {
  _id?: string;
  name: string;
  prices: Price[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
};
