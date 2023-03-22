
const Router = require('express')
const router = new Router()
const nzetaController = require('../../controllers/parser/nzetaController')
const checkRole = require('../../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', nzetaController.nzeta) // добавление нового товара или обновление цен
    router.get('/nzeta_api', nzetaController.nzetaAPI) // 
}
router.post('/', checkRole("ADMIN"), nzetaController.nzeta) // добавление нового товара или обновление цен
router.post('/nzeta_api', checkRole("ADMIN"), nzetaController.nzetaAPI) // 



module.exports = router