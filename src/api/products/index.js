/** @format */

import express from "express"
import createHttpError from "http-errors"
import ProductModel from "./model.js"
import q2m from "query-to-mongo"

const productRouter = express.Router()

productRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductModel(req.body)
    const { _id } = await newProduct.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})
productRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query)
    const totalProducts = await ProductModel.countDocuments(mongoQuery.criteria)
    const products = await ProductModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate({ path: "reviews" }) //http://localhost:3001/products?title=Windows Internals1
    //.populate({ path: "authors", select: "firstName lastName" }) //http://localhost:3001/products?title=Windows Internals1
    // return { totalProducts, products }
    res.send({
      links: mongoQuery.links("http://localhost:3001/products", totalProducts),
      totalProducts,
      totalPages: Math.ceil(totalProducts / mongoQuery.options.limit),
      products,
    })
  } catch (error) {
    next(error)
  }
})
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId)
    //   .populate({
    //   path: "Reviews",
    //   //select: "firstName lastName",
    // })
    if (product) {
      res.send(product)
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})
productRouter.put("/:productId", async (req, res, next) => {
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    )

    if (updateProduct) {
      res.send(updateProduct)
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})
productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deleteProduct = await ProductModel.findByIdAndDelete(
      req.params.productId
    )
    if (deleteProduct) {
      res.status(204).send()
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

export default productRouter
