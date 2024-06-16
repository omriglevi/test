const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET

const adminAuth = (req, res, next) => {
    const token = req.cookies?.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          throw new Error(err.message)
        } else {
          if (decodedToken.role !== "admin") {
            throw new Error("Not authorized, admin only")
          } else {
            next()
          }
        }
      })
    } else {
        throw new Error("Not authorized, invalid token")
    }
  }


  module.exports = { adminAuth }
