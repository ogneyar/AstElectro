
const { Cart } = require('../models/models')


class CartController {

    async create(req, res, next) {
        try {
            let { userId, value } = req.body
            if (value && typeof(value) !== "string") value = JSON.stringify(value)
            let cart = await Cart.findOne({
                where: { userId }
            })
            if (cart) {
                await Cart.update({ userId, value }, {
                    where: { userId }
                })
            }else {
                cart = await Cart.create({ userId, value })
            }

            return res.json(cart) // return 

        }catch(e) {
            return next(res.json({error:'Ошибка метода create! ' + e}))
        }
    }

    async getAll(req, res, next) {
        try {
            const cart = await Cart.findAll()
            return res.json(cart) // return array
        }catch(e) {
            return next(res.json({error:'Ошибка метода getAll! ' + e}))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const cart = await Cart.findOne({
                where: { userId: id }
            })
            return res.json(cart) // return object
        }catch(e) {
            return next(res.json({error:'Ошибка метода getOne! ' + e}))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const body = req.body
            const cart = await Cart.update(body, {
                where: { id }
            })
            return res.json(cart) // return boolean
        }catch(e) {
            return next(res.json({error:'Ошибка метода update! ' + e}))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const cart = await Cart.destroy({
                where: { id }
            })
            return res.json(cart) // return boolean
        }catch(e) {
            return next(res.json({error:'Ошибка метода delete! ' + e}))
        }
    }

}

module.exports = new CartController()