
const Router = require('express')
const router = new Router()
const kedrController = require('../../controllers/parser/kedrController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', kedrController.kedr) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), kedrController.kedr) // добавление нового товара или обновление цен



module.exports = router
