const {Category, Brand, Product} = require('../models/models')
const ApiError = require('../error/apiError')
const getCategoryArrays = require('../service/category/getCategoryArrays')
const getCategoriesForBrand = require('../service/category/getCategoriesForBrand')


class CategoryController {

    async create(req, res, next) {
        try {
            const body = req.body
            const category = await Category.create(body)
            return res.json([category]) // return array
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода create!'));
        }
    }
    
    async getAll(req, res, next) {
        try {
            const categories = await Category.findAll()
            return res.json(categories) // return array
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getAll!'));
        }
    }

    async getCategories(req, res, next) {
        try {
            const { sub_id } = req.params
            const categories = await Category.findAll({
                where: { sub_category_id: sub_id } // при sub_id = 0, ввернутся категории первого ряда
            })
            return res.json(categories) // return array
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getCategories!'));
        }
    }

    async getCategoriesForBrand(req, res, next) {
        try {
            const { brand } = req.params

            let categories = await getCategoriesForBrand(brand)

            return res.json(categories)
        }catch(e) {
            return res.json({ error: 'Ошибка метода getCategoriesForBrand! ' + e })
        }
    }

    async getCategoryArrays(req, res, next) {
        try {
            const { name_category } = req.params

            let object = getCategoryArrays(name_category)

            return res.json(object)
        }catch(e) {
            return res.json({ error: 'Ошибка метода getCategoryArrays! ' + e })
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const category = await Category.destroy({
                where: {id}
            })
            return res.json(category) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода delete!'));
        }
    }

    async edit(req, res, next) {
        try {
            const {id} = req.params
            const body = req.body
            const category = await Category.update(body, {
                where: { id }
            })
            return res.json(category) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода edit!'));
        }
    }

}

module.exports = new CategoryController()