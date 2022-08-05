/** @format */

import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import productRouter from "./api/products/index.js"
import reviewRouter from "./api/reviews/index.js"
import usersRouter from "./api/users/index.js"

import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

// *********************************** MIDDLEWARES ***************************************
server.use(cors())
server.use(express.json())

// ************************************ ENDPOINTS ****************************************
server.use("/products", productRouter)
server.use("/reviews", reviewRouter)
server.use("/users", usersRouter)

// ********************************* ERROR HANDLERS **************************************
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})
