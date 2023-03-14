const ApiError = require('../error/apiError')

const sendMessageAdmin = require('../service/telegram/sendMessage')


class TelegramController {
    
    async sendMessage(req, res, next) {
        try {
            let { message } = req.body
            let response = await sendMessageAdmin(message)
            return res.json(response) // return 
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода sendMessage!'));
        }
    }

}

module.exports = new TelegramController()