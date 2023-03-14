const { ProductSize } = require('../models/models')


class ProductSizeController {

    async getAll(req, res, next) {
        try {
            return res.json(await ProductSize.findAll())
        }catch(e) {
            return res.json({error:'Ошибка метода getAll!'})
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const size = await ProductSize.findOne({
                where: {ProductId: id}
            })
            return res.json(size)
        }catch(e) {
            return res.json({error:'Ошибка метода getOne!'})
        }
    }
}

module.exports = new ProductSizeController()