
const axios = require('axios')

const ApiError = require('../../error/apiError')


class parseController {

 
    async mailRu(req, res, next) {
        try {
            let { email } = req.query
            let response
            
            await axios.post("https://e.mail.ru/api/v1/user/password/restore", { email })
                .then(res => response = res.data)
                .catch(err => response = err)
            
            return res.json(response)
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода mailRu!'));
        }
    }

    async yaRu(req, res, next) {
        try {
            let { email } = req.query
            let response
            await axios.post("https://passport.yandex.ru/registration-validations/auth/multi_step/start", { login:email })
                .then(res => response = res.data)
                .catch(err => response = err)
            return res.json(response)
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода yaRu!'));
        }
    }


}

module.exports = new parseController()