
const jwt = require('jsonwebtoken')

const tokenService = require('../service/tokenService')


module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.json({message: 'Не авторизован!'})
        }

        const token = req.headers.authorization.split(' ')[1] // Bearer token_hdfgdfbdseef
        if (!token) {
            return res.json({message: 'Не авторизован!'})
        }

        const userData = tokenService.validateAccessToken(token);
        if (!userData) {
            return res.json({message: 'Не авторизован!!'})
        }

        req.user = userData

        next()
    }catch (e) {
        return res.json({message: 'Не авторизован!!!'})
    }
}