/** @format */

import mongoose from "mongoose"

const { Schema, model } = mongoose

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ["electronics", "computer", "books"],
    },

    reviews: [{ type: Schema.Types.ObjectId, ref: "Reviews" }],
    // content: { type: String, required: false },
    //commentHistory: [{ comment: String, rate: Number, created_At: Date }],
  },
  {
    timestamps: true,
  }
)
export default model("Products", productsSchema)
