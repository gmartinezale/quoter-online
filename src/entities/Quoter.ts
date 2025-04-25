import { CategoryDoc } from "./Category";
import { ProductDoc } from "./Product";
import { TypeDoc } from "./Type";

export type ExtraProductQuoter = {
  description: string;
  price: number;
  amount: number;
};

export type ProductsQuoter = {
  type: string | ProductDoc;
  amount: number;
  price: number;
  description: string | TypeDoc;
  isFinished: boolean;
  category: string | CategoryDoc;
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
