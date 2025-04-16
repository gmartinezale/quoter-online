import { Document, Schema, model } from "mongoose";
import "./product";
import "./type";
import "./category";
import { Type } from "@/entities/Type";
import { Product } from "@/entities/Product";
import { Category } from "@/entities/Category";

interface IExtraProductQuoter {
  description: string;
  price: number;
  amount: number;
}
interface IProductsQuoter {
  type: string | Product;
  amount: number;
  price: number;
  description: string | Type;
  isFinished: boolean;
  category: string | Category;
  extras: IExtraProductQuoter[];
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
        type: { type: Schema.Types.ObjectId, ref: "Product" },
        amount: Number,
        price: Number,
        description: { type: Schema.Types.ObjectId, ref: "Type" },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        isFinished: { type: Boolean, default: false },
        extras: [
          {
            _id: false,
            description: String,
            price: Number,
            amount: Number,
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
