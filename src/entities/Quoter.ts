import { Product } from "./Product";

export type ProductsQuoter = {
  product: Product;
  amount: number;
  price: number;
  description: string;
  isFinished: boolean;
};

export type Quoter = {
  _id?: string;
  totalAmount: number;
  artist: string;
  active: boolean;
  products: ProductsQuoter[];
  dateLimit: Date;
  fileSended: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
