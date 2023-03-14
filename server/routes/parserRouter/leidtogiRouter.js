const Router = require('express')
const router = new Router()
const leidtogiController = require('../../controllers/parser/leidtogiController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', leidtogiController.leidtogi) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), leidtogiController.leidtogi) // добавление нового товара или обновление цен



module.exports = router