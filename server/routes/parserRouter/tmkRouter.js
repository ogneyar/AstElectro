const Router = require('express')
const router = new Router()
const tmkController = require('../../controllers/parser/tmkController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', tmkController.tmk) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), tmkController.tmk) // добавление нового товара или обновление цен



module.exports = router