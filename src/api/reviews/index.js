/** @format */

import express from "express"
import createHttpError from "http-errors"
import ReviewModel from "./model.js"
import ProductModel from "../products/model.js"

const reviewRouter = express.Router()

reviewRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const newReview = new ReviewModel(req.body)
    const { _id } = await newReview.save()
    const findProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      { $push: { reviews: _id } },
      { new: true, runValidators: true }
    )
    if (!findProduct)
      return next(
        createHttpError(
          404,
          `product with id: ${req.params.productId} not foud`
        )
      )
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})
reviewRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviews = await ProductModel.findById(req.params.productId).populate(
      "reviews"
    )
    if (!reviews)
      return next(
        createHttpError(
          404,
          `product with id: ${req.params.productId} not foud`
        )
      )
    res.send(reviews)
  } catch (error) {
    next(error)
  }
})
reviewRouter.get("/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewModel.findById(req.params.reviewId)
    if (review) {
      res.send(review)
    } else {
      next(createError(404, `Review with id ${req.params.reviewId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
reviewRouter.put("/reviews/:reviewId", async (req, res, next) => {
  try {
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true, runValidators: true }
    )
    if (updatedReview) {
      res.send(updatedReview)
    } else {
      next(createError(404, `Review with id ${req.params.reviewId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
reviewRouter.delete("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      { $pull: { reviews: { _id: req.params.reviewId } } },
      { new: true, runValidators: true }
    )
    if (!updatedProduct)
      return next(
        createHttpError(
          404,
          `product with id: ${req.params.productId} not foud`
        )
      )

    const deletedReview = await ReviewModel.findByIdAndDelete(
      req.params.reviewId
    )

    if (!deletedReview)
      return next(
        createHttpError(404, `review with id: ${req.params.reviewId} not foud`)
      )

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default reviewRouter
