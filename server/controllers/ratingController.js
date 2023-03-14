const { Rating } = require('../models/models')
const ApiError = require('../error/apiError')


class RatingController {
    
    async create(req, res, next) {
        try {
            const body = req.body
            const rating = await Rating.create(body)
            return res.json([rating]) // return array
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода create!'));
        }
    }

    async getAll(req, res, next) { // рейтинг по одному товару
        try {
            const {productId} = req.params 
            const ratings = await Rating.findAll({
                where: { productId }
            })
            return res.json(ratings) // return array
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getAll!'));
        }
    }

    async getOne(req, res, next) { // рейтинг по одному товару одного клиента
        try {
            const {productId, userId} = req.query 
            if (userId) {
                const ratings = await Rating.findOne({
                    where: { productId, userId }
                })
                return res.json(ratings) // return Object
            }else {
                return res.json({error:"Пользователь не авторизован!"})
            }
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getOne!'))
        }
    }

    async delete(req, res, next) {
        try {
            const {userId,productId} = req.body
            const rating = await Rating.destroy({
                where: { userId, productId }
            })
            return res.json(rating) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода delete!'));
        }
    }
    
    async edit(req, res, next) {
        try {
            const {userId,productId,rate} = req.body
            const rating = await Rating.update({rate}, {
                where: { userId, productId }
            })
            return res.json(rating) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода edit!'));
        }
    }

}

module.exports = new RatingController()