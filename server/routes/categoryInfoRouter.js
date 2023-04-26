
const Router = require('express')
const router = new Router()
const categoryInfoController = require('../controllers/categoryInfoController')
// const checkRole = require('../middleware/checkRoleMiddleware')

// router.post('/', checkRole('ADMIN'), categoryInfoController.create) // создание новой записи
router.get('/', categoryInfoController.getAll) // получение всех записей
router.get('/:id', categoryInfoController.getOne) // получение записи по id

module.exports = router
