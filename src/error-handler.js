const errorHandler = (err, req, res, next) => {
    if (err) {
        console.log('Error was occurred', err)
        res.status(401).json({ message: err.message })
    }
    next()

}

module.exports = errorHandler
