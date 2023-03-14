const { Brand } = require('../models/models')
const ApiError = require('../error/apiError')


class BrandController {

    async create(req, res, next) {
        try {
            let { name } = req.body
            if ( ! name ) name = req.query && req.query.name
            const brand = await Brand.create( { name } )
            return res.json([brand]) // return array
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода create! ' + e));
        }
    }

    async getAll(req, res, next) {
        try {
            return res.json(await Brand.findAll()) // return
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getAll! ' + e));
        }
    }

    async getOne(req, res, next) {
        try {
            return res.json(await Brand.findOne({
                where: { id: req.query.id }
            })) // return
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getOne! ' + e));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const brand = await Brand.destroy({
                where: {id}
            })
            return res.json(brand) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода delete! ' + e));
        }
    }
    
    async edit(req, res, next) {
        try {
            const {id} = req.params
            const body = req.body
            const brand = await Brand.update(body, {
                where: { id }
            })
            return res.json(brand) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода edit! ' + e));
        }
    }


}

module.exports = new BrandController()