const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')
const jwtSecret = process.env.JWT_SECRET


const register = async (req, res, next) => {
    const { username, password } = req.body
    try {
        if (!password?.length || password.length < 6) {
            throw new Error('Password less than 6 characters')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'admin'
        })

        const maxAge = 30 * 60 * 60; // 30hrs in seconds
        const token = jwt.sign(
            { id: user._id, username, role: user.role }, jwtSecret, { expiresIn: maxAge }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 30hrs in ms
        });

        res.status(201).json({
            message: "User successfully created",
            user: user._id,
        });

    } catch (err) {
        next(err)
    }
}


const login = async (req, res, next) => {
    const { username, password } = req.body
    try {
        if (!username || !password) {
            throw new Error("Username or password missing")
        }

        const user = await User.findOne({ username })

        if (!user) {
            res.status(401).json({
                message: "Login not successful",
            })
        } else {
            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                throw new Error("Incorrect Password")
            }


            const maxAge = 3 * 60 * 60 // 30hrs in sec
            const today = new Date();
            const thirtyHoursFromNow = today.setDate(today.getDate() + 30/24);

            const token = jwt.sign(
                { id: user._id, username, role: user.role },
                jwtSecret,
                {
                    expiresIn: '30h'
                }
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 30hrs in ms
            });
            res.status(201).json({
                message: "User successfully Logged in",
                user: user._id,
                username: user.username,
                token,
                expiresIn: thirtyHoursFromNow,
            });

        }
    } catch (error) {
        next(error)
    }
}

const logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: "1" })
    res.redirect("/")
}

module.exports = { register, login, logout }
