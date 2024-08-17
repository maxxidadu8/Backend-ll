import { Schema, model } from "mongoose";

export const cartSchema = new Schema({
  products: [
    {
      _id: false,
      quantity: {
        type: Number,
        required: true 
      },
      product: {
        type: Schema.Types.ObjectId,
        ref: "products"
      }
    },
    {
      timestamps: true,
    }
  ]
});

export const CartModel = model("carts", cartSchema);
