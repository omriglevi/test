const { login, register, logout } = require('./auth')
const middleware = require('./middleware')

module.exports = {
    login,
    register,
    logout,
    middleware
}
