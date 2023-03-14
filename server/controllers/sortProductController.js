
const Product = require("../models/Product")
const SortProduct = require("../models/SortProduct")

const mixAllProducts = require("../service/product/mixAllProducts")
const mixPromo = require("../service/product/mixPromo")
const sortProductsWithOutImage = require("../service/product/sortProductsWithOutImage")


class sortProductController {

    async setAll(req, res) {
        try {
            let products = await Product.findAll({ 
                where: { have: 1 },
                // attributes: [ 'id', 'promo', 'img', 'brandId' ]
            })

            let stringifyProducts = JSON.stringify(products)
            
            let mix_all = JSON.parse(stringifyProducts)
            mix_all = mixAllProducts(mix_all)  

            let mix_no_img = JSON.parse(stringifyProducts)
            mix_no_img = sortProductsWithOutImage(mix_no_img)

            let mix_all_and_mix_no_img = JSON.parse(stringifyProducts)
            mix_all_and_mix_no_img = mixAllProducts(mix_all_and_mix_no_img)
            mix_all_and_mix_no_img = sortProductsWithOutImage(mix_all_and_mix_no_img)

            let mix_promo = JSON.parse(stringifyProducts)
            mix_promo = mixPromo(mix_promo)

            let mix_all_with_promo = JSON.parse(stringifyProducts)
            mix_all_with_promo = mixAllProducts(mix_all_with_promo)
            mix_all_with_promo = mixPromo(mix_all_with_promo)
            
            let mix_no_img_with_promo = JSON.parse(stringifyProducts) 
            mix_no_img_with_promo = sortProductsWithOutImage(mix_no_img_with_promo)
            mix_no_img_with_promo = mixPromo(mix_no_img_with_promo)

            let mix_all_and_mix_no_img_with_promo = JSON.parse(stringifyProducts)
            mix_all_and_mix_no_img_with_promo = mixAllProducts(mix_all_and_mix_no_img_with_promo)
            mix_all_and_mix_no_img_with_promo = sortProductsWithOutImage(mix_all_and_mix_no_img_with_promo)
            mix_all_and_mix_no_img_with_promo = mixPromo(mix_all_and_mix_no_img_with_promo)

            let sortProducts = await SortProduct.findAll()

            // console.log(sortProducts[0])

            for(let item = 0; item < products.length; item++) {
                if (sortProducts[item] !== undefined) {
                    await SortProduct.update({
                        mix_all: mix_all[item].id,
                        mix_no_img: mix_no_img[item].id,
                        mix_all_and_mix_no_img: mix_all_and_mix_no_img[item].id,
                        mix_promo: mix_promo[item].id,
                        mix_all_with_promo: mix_all_with_promo[item].id,
                        mix_no_img_with_promo: mix_no_img_with_promo[item].id,
                        mix_all_and_mix_no_img_with_promo: mix_all_and_mix_no_img_with_promo[item].id,
                        productId: products[item].id
                    }, { where: { id: sortProducts[item].id } })
                }else {
                    await SortProduct.create({
                        mix_all: mix_all[item].id,
                        mix_no_img: mix_no_img[item].id,
                        mix_all_and_mix_no_img: mix_all_and_mix_no_img[item].id,
                        mix_promo: mix_promo[item].id,
                        mix_all_with_promo: mix_all_with_promo[item].id,
                        mix_no_img_with_promo: mix_no_img_with_promo[item].id,
                        mix_all_and_mix_no_img_with_promo: mix_all_and_mix_no_img_with_promo[item].id,
                        productId: products[item].id
                    })
                }
            }
            
            // return res.json(sortProducts)
            return res.json("ok")
        }catch(e) {
            return res.json({error: 'Ошибка метода setAll! ' + e})
        }
    }
 
    async getAll(req, res) {
        try {
            // let { brandId } = req.query
            
            let sortProducts = await SortProduct.findAll()
            
            return res.json(sortProducts)
        }catch(e) {
            return res.json({error: 'Ошибка метода getAll!'})
        }
    }

}


module.exports = new sortProductController()