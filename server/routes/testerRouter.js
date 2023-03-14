const Router = require('express')
const router = new Router()
const testerController = require('../controllers/testerController')
const checkRole = require('../middleware/checkRoleMiddleware')


if (process.env.URL === "http://localhost:5000") {
    router.get('/set_feed', testerController.setFeed)
    router.get('/set_sitemap', testerController.setSitemap)
}
router.post('/set_feed', checkRole("ADMIN"), testerController.setFeed)
router.post('/set_sitemap', checkRole("ADMIN"), testerController.setSitemap)


router.get('/big_desc', testerController.bigDescription)
router.get('/big_desc/:id', testerController.bigDescriptionEdit)

router.get('/temp', testerController.temp)


module.exports = router