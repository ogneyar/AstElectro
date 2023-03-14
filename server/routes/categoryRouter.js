const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/categoryController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), categoryController.create) // создание новой записи
router.get('/', categoryController.getAll) // получение всех записей
router.get('/brand/:brand', categoryController.getCategoriesForBrand) // получение записей по заданному имени бренда
router.get('/arrays/:name_category', categoryController.getCategoryArrays) // получение массивов категорий по заданной категории
router.get('/:sub_id', categoryController.getCategories) // получение записей по задданной подкатегории (при sub_id = 0, вернутся записи первого ряда категорий)
router.delete('/:id', checkRole('ADMIN'), categoryController.delete) // удаление записи
router.put('/:id', checkRole('ADMIN'), categoryController.edit) // редактирование записей

module.exports = router