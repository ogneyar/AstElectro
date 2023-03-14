const Router = require('express')
const router = new Router()

const productSizeController = require('../controllers/productSizeController')

router.get('/', productSizeController.getAll)
router.get('/:id', productSizeController.getOne)


module.exports = router