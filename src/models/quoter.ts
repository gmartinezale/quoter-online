import { Product } from "@/entities/Product";
import { Document, Schema, model } from "mongoose";
import "./product";

interface IProductsQuoter {
  product: string | Product;
  amount: number;
  price: number;
  description: string;
  isFinished: boolean;
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
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        amount: Number,
        price: Number,
        description: String,
        isFinished: { type: Boolean, default: false },
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
