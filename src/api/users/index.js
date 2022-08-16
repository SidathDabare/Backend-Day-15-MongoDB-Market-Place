/** @format */

import express from "express"
import createHttpError from "http-errors"
import UsersModel from "./model.js"
import ProductsModel from "../products/model.js"
import CartsModel from "./cartsModel.js"
import { sendRegistrationEmail } from "../../lib/email-tools.js"
import cartsModel from "./cartsModel.js"
//import BooksModel from "../books/model.js"
//import LikeModel from "./likesModel.js"
console.log({ ProductsModel })
console.log({ UsersModel })
console.log({ CartsModel })
const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId)
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId, // WHO you want to modify
      req.body, // HOW you want to modify
      { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly update record you should use the option new: true
      // By default validation is off here --> runValidators: true
    )

    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId)
    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// usersRouter.post("/:userId/purchaseHistory", async (req, res, next) => {
//   try {
//     // We gonna receive a productId in the req.body. Given that Id, we would like to insert the corresponding book into the purchaseHistory of the specified user

//     // 1. Find the book in the books' collection by id
//     const purchasedProduct = await BooksModel.findById(req.body.productId, { _id: 0 }) // here we could use projection {_id: 0} to remove the original _id from the purchasedBook. We should do this because in this way Mongo will automagically create a unique _id for the items in the array

//     if (purchasedBook) {
//       // 2. If the book is found --> add additional informations like purchaseDate
//       const bookToInsert = { ...purchasedBook.toObject(), purchaseDate: new Date() } // purchasedBook (and EVERYTHING you get from .find .findById .findOne, ...) is a MONGOOSE OBJECT. Therefore if I want to spread it I shall convert it into a PLAIN OBJECT first by using .toObject() (as an alternative you could use .lean() after find methods)

//       // 3. Update the specified user by adding that book to the purchaseHistory array
//       const updatedUser = await UsersModel.findByIdAndUpdate(
//         req.params.userId, // WHO
//         { $push: { purchaseHistory: bookToInsert } }, // HOW
//         { new: true, runValidators: true } // OPTIONS
//       )
//       if (updatedUser) {
//         res.send(updatedUser)
//       } else {
//         next(createHttpError(404, `User with id ${req.params.userId} not found!`))
//       }
//     } else {
//       // 4. In case of book not found --> 404
//       next(createHttpError(404, `Book with id ${req.body.bookId} not found!`))
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.get("/:userId/purchaseHistory", async (req, res, next) => {
//   try {
//     const user = await UsersModel.findById(req.params.userId)
//     if (user) {
//       res.send(user.purchaseHistory)
//     } else {
//       next(createHttpError(404, `User with id ${req.params.userId} not found!`))
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.get("/:userId/purchaseHistory/:productId", async (req, res, next) => {
//   try {
//     const user = await UsersModel.findById(req.params.userId)
//     if (user) {
//       const purchasedBook = user.purchaseHistory.find(book => req.params.productId === book._id.toString()) // You CANNOT compare a string (req.params.productId) with an ObjectId (book._id)! --> SOLUTION: you could either convert the string into an ObjectId or the ObjectId into a string
//       if (purchasedBook) {
//         res.send(purchasedBook)
//       } else {
//         next(createHttpError(404, `Book with id ${req.params.productId} not found!`))
//       }
//     } else {
//       next(createHttpError(404, `User with id ${req.params.userId} not found!`))
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.put("/:userId/purchaseHistory/:productId", async (req, res, next) => {
//   try {
//     // 1. Find user by id (obtaining a MONGOOSE DOCUMENT)
//     const user = await UsersModel.findById(req.params.userId)

//     if (user) {
//       // 2. Update the item in the array by using normal JS code
//       // 2.1 Search for the index of the product into the purchaseHistory array

//       const index = user.purchaseHistory.findIndex(book => book._id.toString() === req.params.productId)

//       if (index !== -1) {
//         // 2.2 Modify that product
//         user.purchaseHistory[index] = { ...user.purchaseHistory[index].toObject(), ...req.body }

//         // 3. Since the user object is a MONGOOSE DOCUMENT I can then use .save() to update that record
//         await user.save()
//         res.send(user)
//       } else {
//         next(createHttpError(404, `Book with id ${req.params.productId} not found!`))
//       }
//     } else {
//       next(createHttpError(404, `User with id ${req.params.userId} not found!`))
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.delete("/:userId/purchaseHistory/:productId", async (req, res, next) => {
//   try {
//     const updatedUser = await UsersModel.findByIdAndUpdate(
//       req.params.userId, // WHO
//       { $pull: { purchaseHistory: { _id: req.params.productId } } }, // HOW
//       { new: true, runValidators: true } // OPTIONS
//     )
//     if (updatedUser) {
//       res.send(updatedUser)
//     } else {
//       next(createHttpError(404, `User with id ${req.params.userId} not found!`))
//     }
//   } catch (error) {
//     next(error)
//   }
// })

usersRouter.post("/:userId/cart", async (req, res, next) => {
  // The purpose of this endpoint is to add an item (and quantity) to the Active cart of the specified user
  try {
    // 0. We gonna receive bookId and the quantity in req.body
    const { product_Id, quantity } = req.body
    console.log(product_Id)

    // 1. Does the user exist? If not --> 404
    const user = await UsersModel.findById(req.params.userId)
    //console.log(user)
    if (!user)
      return next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      )

    // 2. Does the product exist? If not --> 404
    const purchasedProduct = await ProductsModel.findById(product_Id)
    //console.log(purchasedProduct)
    if (!purchasedProduct)
      return next(
        createHttpError(404, `Product with id ${product_Id} not found!`)
      )

    // 3. Is the product already in the ACTIVE cart of the specified user?
    const isProductThere = await CartsModel.findOne({
      owner: req.params.userId,
      status: "Active",
      "products.productId": product_Id,
    })
    //console.log(isProductThere)
    if (isProductThere) {
      const modifiedCart = await CartsModel.findOneAndUpdate(
        {
          owner: req.params.userId,
          status: "Active",
          "products.productId": product_Id,
        }, // WHAT we want to modify
        { $inc: { "products.$.quantity": quantity } }, // HOW we want to modify
        { new: true, runValidators: true } // OPTIONS
      )
      //console.log("if CART", modifiedCart)
      res.send(modifiedCart)
    } else {
      // 3.2 If it is not --> add it to cart (if the cart exists)
      const modifiedCart = await CartsModel.findOneAndUpdate(
        { owner: req.params.userId, status: "Active" }, // WHAT
        { $push: { products: { productId: product_Id, quantity } } }, // HOW
        { new: true, runValidators: true, upsert: true } // OPTIONS, upsert: true does mean that if the active cart of that user is NOT found --> Please Mongo create that automagically (also with the product in it)
      )
      //console.log("if NOT", modifiedCart)
      res.send(modifiedCart)
    }
  } catch (error) {
    next(error)
  }
})
usersRouter.get("/:userId/cart", async (req, res, next) => {
  // The purpose of this endpoint is to add an item (and quantity) to the Active cart of the specified user
  try {
    const user = await cartsModel.find()
    console.log(user)

    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
usersRouter.post("/register", async (req, res, next) => {
  try {
    // 1. receive user's data from req.body
    const { email } = req.body
    // 2. save new user in db
    // 3. send email to new user
    await sendRegistrationEmail(email)
    res.send({ message: "User registered and email sent!" })
  } catch (error) {
    next(error)
  }
})

export default usersRouter
