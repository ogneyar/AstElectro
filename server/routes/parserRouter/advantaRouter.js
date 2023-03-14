
const Router = require('express')
const router = new Router()
const advantaController = require('../../controllers/parser/advantaController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', advantaController.advanta) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), advantaController.advanta) // добавление нового товара или обновление цен



module.exports = router