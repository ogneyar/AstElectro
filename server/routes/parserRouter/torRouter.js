
const Router = require('express')
const router = new Router()
const torController = require('../../controllers/parser/torController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', torController.tor) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), torController.tor) // добавление нового товара или обновление цен



module.exports = router