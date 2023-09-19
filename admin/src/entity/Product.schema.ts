import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  image: string;
  likes: number;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);
