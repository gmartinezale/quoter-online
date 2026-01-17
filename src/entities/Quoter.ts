import { ProductDoc } from "./Product";

// Extra product added to quotation
export type ExtraProductQuoter = {
  description: string;
  price: number;
  amount: number;
};

export type ProductPrice = {
  description: string;
  price: number;
};

// Product item in quotation with selected type and finish
export type ProductsQuoter = {
  product: string | ProductDoc; // Reference to the product
  productType?: ProductPrice; // ID of the selected type from product.types
  productFinish?: ProductPrice; // ID of the selected finish from product.finishes
  amount: number;
  price: number; // Calculated price (base + type + finish)
  isFinished: boolean;
  extras: ExtraProductQuoter[]; // Selected extras from product.extras
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
