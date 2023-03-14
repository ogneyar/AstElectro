const Router = require('express')
const router = new Router()
const husqvarnaController = require('../../controllers/parser/husqvarnaController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', husqvarnaController.husqvarna) // добавление нового товара или обновление цен
}
router.post('/', checkRole("ADMIN"), husqvarnaController.husqvarna) // добавление нового товара или обновление цен

router.get('/test', husqvarnaController.test) // тест 


module.exports = router