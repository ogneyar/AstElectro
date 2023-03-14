const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, ratingController.create) // создание новой записи
router.get('/:productId', ratingController.getAll) // получение записей по одному товару
router.get('/', authMiddleware, ratingController.getOne) // получение записей одного клиента по одному товару
router.delete('/', authMiddleware, ratingController.delete) // удаление записи
router.put('/', authMiddleware, ratingController.edit) // редактирование записей

module.exports = router
