const Router = require('express')
const router = new Router()
const dealerController = require('../controllers/dealerController')
// const checkRole = require('../middleware/checkRoleMiddleware')


router.get('/feed', dealerController.getFeed) // получение фида абразивных материалов


module.exports = router