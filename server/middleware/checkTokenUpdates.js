

const ApiError = require('../error/apiError')


const checkTokenUpdates = () => {

    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            let { token } = req.body
            
            if ( ! token ) token = req.query && req.query.token

            if ( ! token ) {
                return next(ApiError.unauthorized('Нет доступа!'))
            }

            if (token !== process.env.TOKEN_UPDATES) {
                return next(ApiError.unauthorized('Нет доступа!!'))
            }

            next()
        }catch (e) {
            return next(ApiError.unauthorized('Нет доступа!!!'))
        }
    }
}


module.exports = checkTokenUpdates
