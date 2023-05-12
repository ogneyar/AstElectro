const Router = require('express')
const router = new Router()

const mailController = require('../controllers/mailController')

if (process.env.URL === "http://localhost:5000") {
    router.get('/request_price', mailController.requestPrice) 
    router.get('/request_products', mailController.requestProducts) 
}

router.post('/request_price', mailController.requestPrice) 
router.post('/request_products', mailController.requestProducts) 

module.exports = router