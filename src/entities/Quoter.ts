import { Type } from "./Type";

export type ExtraProductQuoter = {
  description: string;
  price: number;
  amount: number;
};

export type ProductsQuoter = {
  type: string | Type;
  amount: number;
  price: number;
  description: string;
  isFinished: boolean;
  category: string;
  extras: ExtraProductQuoter[];
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
