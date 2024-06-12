const { login, register } = require('./auth')
const middleware = require('./middleware')

module.exports = {
    login,
    register,
    middleware
}
