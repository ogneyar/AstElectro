// 
const { CategoryInfo } = require('../models/models')
// const ApiError = require('../error/apiError')


class CategoryInfoController {

    async getAll(req, res, next) {
        try {
            const info = await CategoryInfo.findAll()
            return res.json(info) // return array
        }catch(e) {
            // return next(ApiError.badRequest('Ошибка метода getAll!'))
            return res.json( { error: 'Ошибка метода getAll! ' + e } )
        }
    }


    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const info = await CategoryInfo.findOne({
                where: { id }
            })
            return res.json(info) // return object
        }catch(e) {
            // return next(ApiError.badRequest('Ошибка метода getOne!'))
            return res.json( { error: 'Ошибка метода getOne! ' + e } )
        }
    }
    
}

module.exports = new CategoryInfoController()
