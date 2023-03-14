
const { Brand, Product, Category, ProductInfo, ProductSize } = require('../models/models')
const FeedDto = require('../dtos/feedDto')


class DealerController {

    async getFeed(req, res, next) {
        try {
            const brand = await Brand.findOne({
                where: { name: "Leidtogi"} // id = 10
            })

            // let products = []; products[0] = await Product.findOne( { // для теста (показ одной записи)
            let products = await Product.findAll( { 
                where: { brandId: brand.id, have: 1 },
                include: [
                    { model: Category, as: 'category' },
                    { model: ProductInfo, as: 'info' },
                    { model: ProductSize, as: 'size' }
            ]
            } )

            return res.json( products.map( product => new FeedDto(product) ) )

        }catch(e) {
            return next(res.json( { error: 'Ошибка метода getFeed! ' + e} ));
        }
    }

}

module.exports = new DealerController()