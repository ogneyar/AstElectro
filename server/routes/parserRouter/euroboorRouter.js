
const Router = require('express')
const router = new Router()
const euroboorController = require('../../controllers/parser/euroboorController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', euroboorController.euroboor) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), euroboorController.euroboor) // добавление нового товара или обновление цен



module.exports = router