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
      enum: ["smart phones", "computer", "books"],
    },

    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    // content: { type: String, required: false },
    //commentHistory: [{ comment: String, rate: Number, created_At: Date }],
  },
  {
    timestamps: true,
  }
)
export default model("products", productsSchema)
