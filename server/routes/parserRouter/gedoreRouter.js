const Router = require('express')
const router = new Router()
const gedoreController = require('../../controllers/parser/gedoreController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', gedoreController.gedore) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), gedoreController.gedore) // добавление нового товара или обновление цен



module.exports = router