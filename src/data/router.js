const { Router } = require("express")

const router = Router()

const { middleware: { adminAuth } } = require("../auth")

router.route("/data").get(adminAuth, (req, res) => res.send("Data route"))

module.exports = router
