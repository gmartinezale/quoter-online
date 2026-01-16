import { Schema } from "mongoose";

// Subdocument interfaces for nested structures
export interface IProductPrice {
  description: string;
  price: number;
}

// Subdocument schemas
const ProductPriceSchema = new Schema<IProductPrice>(
  {
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

export { ProductPriceSchema };