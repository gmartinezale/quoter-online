import { Category } from "./Category";

// Product type with description and price
export type ProductType = {
  _id?: string;
  description: string;
  price: number;
};

// Product finish with description and price
export type ProductFinish = {
  _id?: string;
  description: string;
  price: number;
};

// Optional extras that can be added to quotation
export type ProductExtra = {
  _id?: string;
  description: string;
  price: number;
};

// Main product entity
export type Product = {
  _id?: string;
  name: string;
  price: number; // Base price
  types: ProductType[]; // Product types
  finishes: ProductFinish[]; // Product finishes
  extras?: ProductExtra[]; // Optional extras
  stock?: number; // Optional stock quantity
  minPurchase?: number; // Optional minimum purchase quantity
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
};

// Simplified product document for references
export type ProductDoc = {
  _id: string;
  name: string;
};
