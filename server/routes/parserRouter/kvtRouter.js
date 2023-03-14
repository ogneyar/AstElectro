const Router = require('express')
const router = new Router()
const kvtController = require('../../controllers/parser/kvtController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', kvtController.kvt) // добавление нового товара
    router.get('/parse', kvtController.parseKvtSu) // обновление цен
    router.get('/save_price', kvtController.savePrice) // сохранение прайса в файл json
}
router.post('/', checkRole("ADMIN"), kvtController.kvt) // добавление нового товара
router.post('/parse', checkRole("ADMIN"), kvtController.parseKvtSu) // обновление цен
router.post('/save_price', checkRole("ADMIN"), kvtController.savePrice) // сохранение прайса в файл json 


module.exports = router