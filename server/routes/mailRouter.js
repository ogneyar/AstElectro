const Router = require('express')
const router = new Router()

const mailController = require('../controllers/mailController')

if (process.env.URL === "http://localhost:5000") {
    router.get('/request_price', mailController.requestPrice) 
    router.get('/request_products', mailController.requestProducts) 
    router.get('/request_products_l', mailController.requestProductsL) 
    router.get('/callback_l', mailController.callbackL) 
    router.get('/send_message_l', mailController.sendMessageL) 
}

router.post('/request_price', mailController.requestPrice) 
router.post('/request_products', mailController.requestProducts) 
router.post('/request_products_l', mailController.requestProductsL) 
router.post('/callback_l', mailController.callbackL) 
router.post('/send_message_l', mailController.sendMessageL) 

module.exports = router