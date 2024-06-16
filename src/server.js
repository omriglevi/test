const express = require("express")
require('dotenv').config()

const { connectDB } = require("./db")
const authRouter = require("./auth/router")
const errorHandler = require("./error-handler")
const auctionsRouter  = require("./auctions/router")
const app = express()
const cookieParser = require("cookie-parser");


app.use(express.json())
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }))
app.use(authRouter) // Router for register and login
app.use(auctionsRouter)// here will be the admin routes
app.use(errorHandler) // Error handler middleware



const PORT = process.env.PORT


const runServer = async () => {
        await connectDB()
        if (!PORT) {
            throw new Error('Server Port is missing! Please provide one to proceed.')
        }
        app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))

}

module.exports = { runServer }
