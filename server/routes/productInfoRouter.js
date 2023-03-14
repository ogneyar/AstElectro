const Router = require('express')
const router = new Router()

const productInfoController = require('../controllers/productInfoController')

router.get('/', productInfoController.getAll)
router.get('/all_one/:id', productInfoController.getAllOneProduct)
router.get('/:id', productInfoController.getOne) // ?title= необходимый параметр


module.exports = router