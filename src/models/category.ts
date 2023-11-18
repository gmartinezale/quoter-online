import { Document, Schema, model } from "mongoose";

interface ICategory extends Document {
  name: string;
  active: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: String,
    active: Boolean,
  },
  { timestamps: true },
);

let Category: any;
try {
  Category = model("Category");
} catch (error) {
  Category = model<ICategory>("Category", CategorySchema);
}

export default Category;
