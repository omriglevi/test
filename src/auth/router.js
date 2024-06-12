const { Router } = require("express")
const { register, login, logout } = require("./auth")

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login);
router.route("/logout").get(logout)

module.exports = router
