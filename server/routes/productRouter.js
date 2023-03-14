const Router = require('express')
const router = new Router()

const productController = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), productController.create)
router.get('/', productController.getAll)

router.get('/by_category', productController.getProductsByCategory)

router.get('/promo', productController.getPromo)

router.get('/temp', productController.temp) // использовал этот роут для удаления нулевых позиций
router.get('/all_without_size', productController.getAllWithOutSize)

router.get('/:id', productController.getOne)
router.get('/url/:url', productController.getOneOnUrl)
router.get('/info/:id', productController.getInfo)
router.get('/size/:id', productController.getSize)
router.put('/edit_sizes/:id', productController.editSizes)
router.delete('/:id', checkRole('ADMIN'), productController.delete)
router.put('/edit/:id', checkRole('ADMIN'), productController.edit)
router.put('/edit_on_article/:article', checkRole('ADMIN'), productController.editOnArticle)
router.put('/edit_all/:id', checkRole('ADMIN'), productController.editAll)
router.put('/rating/:id', authMiddleware, productController.editRating)

router.get('/price/:id', productController.getPrice)


module.exports = router