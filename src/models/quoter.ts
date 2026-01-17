import { Document, Schema, model } from "mongoose";
import "./product";
import { Product } from "@/entities/Product";
import { Category } from "@/entities/Category";
import { IProductPrice, ProductPriceSchema } from "@/interfaces/ProductInterface";

// Extra products added to the quotation
interface IExtraProductQuoter {
  description: string;
  price: number;
  amount: number;
}

// Product item in quotation with selected type and finish
interface IProductsQuoter {
  product: string | Product; // Reference to the product
  productType?: IProductPrice[]; // ID of the selected type from product.types
  productFinish?: IProductPrice[]; // ID of the selected finish from product.finishes
  amount: number;
  price: number; // Calculated price (base + type + finish)
  isFinished: boolean;
  category: string | Category;
  extras: IExtraProductQuoter[]; // Selected extras from product.extras
}

interface IQuoter extends Document {
  totalAmount: number;
  artist: string;
  active: boolean;
  products: IProductsQuoter[];
  dateLimit: Date;
  fileSended: boolean;
  status: string;
}

const QuoterSchema = new Schema<IQuoter>(
  {
    totalAmount: Number,
    artist: String,
    active: Boolean,
    products: [
      {
        _id: false,
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        productType: { type: [ProductPriceSchema], default: [] }, // ID from product.types subdocument
        productFinish: { type: [ProductPriceSchema], default: [] }, // ID from product.finishes subdocument
        amount: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        isFinished: { type: Boolean, default: false },
        extras: [
          {
            _id: false,
            description: { type: String, required: true },
            price: { type: Number, required: true, min: 0 },
            amount: { type: Number, required: true, min: 1 },
          },
        ],
      },
    ],
    dateLimit: Date,
    fileSended: { type: Boolean, default: false },
    status: {
      type: String,
      default: "PENDIENTE",
      enum: ["PENDIENTE", "EN PROCESO", "RECHAZADO", "FINALIZADO"],
    },
  },
  { timestamps: true },
);

let Quoter: any;
try {
  Quoter = model("Quoter");
} catch (error) {
  Quoter = model<IQuoter>("Quoter", QuoterSchema);
}

export default Quoter;
