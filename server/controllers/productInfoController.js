const { ProductInfo } = require('../models/models')


class ProductInfoController {

    async getAll(req, res, next) { // все имеющиеся записи в БД
        try {
            return res.json(await ProductInfo.findAll())
        }catch(e) {
            return res.json({error:'Ошибка метода getAll!'})
        }
    }

    async getAllOneProduct(req, res, next) { // все записи одного товара
        try {
            const { id } = req.params
            const info = await ProductInfo.findAll({
                where: {ProductId: id}
            })
            return res.json(info)
        }catch(e) {
            return res.json({error:'Ошибка метода getAllOneProduct!'})
        }
    }

    async getOne(req, res, next) { // одна конкретная запись
        try {
            const { id } = req.params
            let { title } = req.query
            if (!title) title = "description"
            const info = await ProductInfo.findOne({
                where: {ProductId: id, title}
            })
            return res.json(info)
        }catch(e) {
            return res.json({error:'Ошибка метода getOne!'})
        }
    }
}

module.exports = new ProductInfoController()