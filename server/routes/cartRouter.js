const Router = require('express')
const router = new Router()
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', cartController.create) // создание новой записи

// router.get('/', checkRole("ADMIN"), cartController.getAll) // получение всех записей
router.get('/', cartController.getAll) // получение всех записей
// router.get('/:id', checkRole("ADMIN"), cartController.getOne) // получение записи по задданному id
router.get('/:id', cartController.getOne) // получение записи по задданному id пользователя

router.put('/:id', cartController.update) // редактирование записи

router.delete('/:id', checkRole("ADMIN"), cartController.delete) // удаление записи


module.exports = router