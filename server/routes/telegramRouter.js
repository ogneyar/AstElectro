const Router = require('express')
const router = new Router()
const telegramController = require('../controllers/telegramController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/sendMessage', authMiddleware, telegramController.sendMessage) // отправка сообщения админу


module.exports = router