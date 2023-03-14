
const Router = require('express')
const router = new Router()
const krauseController = require('../../controllers/parser/krauseController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', krauseController.krause) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), krauseController.krause) // добавление нового товара или обновление цен



module.exports = router