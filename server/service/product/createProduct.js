
const { Product, ProductInfo, ProductSize, ProductFilter } = require('../../models/models')
const findProductByArticle = require('./findProductByArticle')


async function createProduct(args) {

    let { name, url, price, have, article, promo, country, brandId, categoryId, img, info, size, filter, request } = args
    
    const oldProduct = await findProductByArticle(article) 
    if (oldProduct) {
        await ProductInfo.destroy({
            where: {productId: oldProduct.id}
        })
        await ProductSize.destroy({
            where: {productId: oldProduct.id}
        })
        await ProductFilter.destroy({
            where: {productId: oldProduct.id}
        })
        await Product.destroy({
            where: {article}
        })
    }

    // console.log(" ");
    // console.log("price",price);
    // console.log(" ");

    const product = await Product.create({name, url, price, have, article, promo, country, brandId, categoryId, img, request}) 

    if (info) {
        let inf
        if (typeof(info) === "string") inf = JSON.parse(info)
        else inf = info
        // if (Array.isArray(info)) inf = info
        // else inf = JSON.parse(info)
        if (Array.isArray(inf)) {
            for (let i = 0; i < inf.length; i++) {
                if (inf[i]) {
                    ProductInfo.create({
                        title: inf[i].title,
                        body: inf[i].body,
                        productId: product.id 
                    })
                }
            }
        }
    }

    if (size) {
        let s
        if (typeof(size) === "string") s = JSON.parse(size)
        else s = size
        // if (Array.isArray(size)) s = size
        // else s = JSON.parse(size)
        if (s.weight || s.volume || s.width || s.height || s.length) {
            if ( ! s.volume && s.width && s.height && s.length ) s.volume = ((s.width * s.height * s.length)/1e9).toFixed(4)
            if (s.weight != 0) s.weight = s.weight.toString().replace(',', '.')
            if (s.volume != 0) s.volume = s.volume.toString().replace(',', '.')
            if (s.width != 0) s.width = s.width.toString().replace(',', '.')
            if (s.height != 0) s.height = s.height.toString().replace(',', '.')
            if (s.length != 0) s.length = s.length.toString().replace(',', '.')
            ProductSize.create({
                weight: s.weight || 0,
                volume: s.volume || 0,
                width: s.width || 0,
                height: s.height || 0,
                length: s.length || 0,
                productId: product.id 
            })
        }
    }

    if (filter) {
        if (typeof(filter) === "string") filter = JSON.parse(filter)
        if (Array.isArray(filter)) {
            filter.forEach(item => {
                ProductFilter.create({
                    name: item.name,
                    value: item.value,
                    productId: product.id 
                })
            })
        }
    }
    
    return product
}


module.exports = createProduct