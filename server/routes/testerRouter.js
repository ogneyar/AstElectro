const Router = require('express')
const router = new Router()
const testerController = require('../controllers/testerController')
const checkRole = require('../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/set_feed', testerController.setFeed)
    router.get('/set_sitemap', testerController.setSitemap)
    // роут для замены пустых изобрражений
    router.get('/edit_images', testerController.editImages)
}
router.post('/set_feed', checkRole("ADMIN"), testerController.setFeed)
router.post('/set_sitemap', checkRole("ADMIN"), testerController.setSitemap)


router.get('/big_desc', testerController.bigDescription)
router.get('/big_desc/:id', testerController.bigDescriptionEdit)

router.get('/temp', testerController.temp)

// добавление множителя (минимального количества заказа товара)
router.get('/added_mult', testerController.addedMult)
// обновление цен
router.get('/update_prices', testerController.updatePrices)


module.exports = router