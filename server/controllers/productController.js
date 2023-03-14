const { Product, ProductInfo, ProductSize, Brand, Category } = require('../models/models')
const {Sequelize} = require('sequelize')
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const createFoldersAndDeleteOldFiles = require('../service/createFoldersAndDeleteOldFiles.js')
const deleteOldFiles = require('../service/deleteOldFiles.js')
const createProduct = require('../service/product/createProduct.js')
const translit = require('../service/translit.js')
const renameFolder = require('../service/renameFolder')
const ProductDto = require('../dtos/productDto')
const getAll = require('../service/product/getAll')
const getCategoryArrays = require('../service/category/getCategoryArrays')


class ProductController {

    async create(req, res, next) {  
        try {
            let { name, price, brandId, categoryId, have, article, promo, country, files, info, size, filter, request } = req.body
            let imgBig, imgSmall, fileName
            let link = ''
            if (req.files && req.files.image1) {

                const brand = await Brand.findOne({
                    where: {id: brandId}
                })
                createFoldersAndDeleteOldFiles(brand.name.toLowerCase(), article)

                for(let i = 0; i < 4; i++) {

                    switch(i) {
                        case 0:
                            if (req.files.image1) imgBig = req.files.image1
                            else continue
                        break;
                        case 1:
                            if (req.files.image2) {
                                imgBig = req.files.image2
                                link += ","
                            }else continue
                        break;
                        case 2:
                            if (req.files.image3) {
                                imgBig = req.files.image3
                                link += ","
                            }else continue
                        break;
                        case 3:
                            if (req.files.image4) {
                                imgBig = req.files.image4
                                link += ","
                            }else continue
                        break;
                        default:
                        break;
                    }
                    
                    imgSmall = imgBig

                    fileName = uuid.v4() + '.jpg'

                    imgBig.mv(path.resolve(__dirname, '..', 'static', brand.name.toLowerCase(), article, 'big', fileName))
                    imgSmall.mv(path.resolve(__dirname, '..', 'static', brand.name.toLowerCase(), article, 'small', fileName))
                    
                    link = link + `{"big": "${brand.name.toLowerCase()}/${article}/big/${fileName}", "small": "${brand.name.toLowerCase()}/${article}/small/${fileName}"}`

                }

                files = `[${link}]`

            }else if (!files) {
                files = "[{}]"
            }

            let url = translit(name) + "_" + article.toString()
            
            let pro = new ProductDto({name, url, price, have, article, promo, country, brandId, categoryId, img:files, info, size, filter, request})

            const product = await createProduct(pro)

            return res.json(product)

        }catch (e) {
            return res.json({error: 'Ошибка метода create! ' + e.message})
        }
    }

    async getAll(req, res) {
        try {
            let { brandId, categoryId, limit, page, mix_all, mix_no_img, mix_promo, filter } = req.query
            
            let products = await getAll({
                brandId, categoryId, limit, page, mix_all, mix_no_img, mix_promo, filter
            })
            
            return res.json(products)
        }catch(e) {
            return res.json({error: 'Ошибка метода getAll! ' + e})
        }
    }

    async getProductsByCategory(req, res) {
        try {
            let { category, limit, page, mix_all, mix_no_img, mix_promo, filter } = req.query 
            
            let selectedCategory = await getCategoryArrays(category) // [ 22, 23, 300, ..., 1023 ]
            
            let products = await getAll({
                categoryId: selectedCategory, limit, page, mix_all, mix_no_img, mix_promo, filter
            })
            
            return res.json(products)
        }catch(e) {
            return res.json({ error: 'Ошибка метода getProductsByCategory! ' + e})
        }
    }

    // сделал этот роут для поиска товаров без габаритов
    async getAllWithOutSize(req, res, next) {
        try {
            let products = await Product.findAll()
            let sizes = await ProductSize.findAll()
            let response = products.filter(i => {
                let no = true
                sizes.forEach(j => {
                    if (i.id === j.productId) no = false
                })
                return no
            })
            return res.json(response)
        }catch(e) {
            // return next(ApiError.badRequest('Ошибка метода getAllWithOutSize!'))
            return res.json({error: 'Ошибка метода getAllWithOutSize!'})
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const product = await Product.findOne({
                where: {id},
                include: [{model: ProductInfo, as: 'info'},{model: ProductSize, as: 'size'}]
            })
            return res.json(product)
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getOne!'));
        }
    }

    async getOneOnUrl(req, res, next) {
        try {
            const {url} = req.params
            const product = await Product.findOne({
                where: {url},
                include: [{model: ProductInfo, as: 'info'},{model: ProductSize, as: 'size'}]
            })
            return res.json(product)
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getOneOnUrl!'));
        }
    }

    async getInfo(req, res, next) {
        try {
            const {id} = req.params
            const info = await ProductInfo.findAll({
                where: {ProductId: id}
            })
            return res.json(info) // return array
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getInfo!'));
        }
    }

    async getSize(req, res, next) {
        try {
            const {id} = req.params
            const size = await ProductSize.findOne({
                where: {ProductId: id}
            })
            return res.json(size)
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getSize!'));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const product = await Product.findOne({
                where: {id}
            })
    
            const brand = await Brand.findOne({
                where: {id:product.brandId}
            })
            
            deleteOldFiles(brand.name.toLowerCase(), product.article)
    
            await ProductInfo.destroy({
                where: {productId: id}
            })
            await ProductSize.destroy({
                where: {productId: id}
            })
            const response = await Product.destroy({
                where: {id}
            })
            return res.json(response)
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода delete!'));
        }
    }

    async edit(req, res, next) {
        try {
            const {id} = req.params
            let body = req.body

            if (body.name !== undefined) {
                const product = await Product.findOne({
                    where: {id}
                })
                if (product.name !== body.name) {
                    let url = translit(body.name) + "_" + body.article.toString()
                    body = { ...body, url }
                }
            }

            const response = await Product.update(body, {
                where: { id }
            })
            return res.json(response) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода edit!'));
        }
    }

    async editSizes(req, res, next) {
        try {
            const {id} = req.params
            const {size} = req.body
            let response
    
            if (size) {
                let s = JSON.parse(size)
                if (s.weight || s.volume || s.width || s.height || s.length) {
                    if ( ! s.volume && s.width && s.height && s.length ) s.volume = ((s.width * s.height * s.length)/1e9).toFixed(4)
                    if (s.weight !== 0) s.weight = s.weight.toString().replace(',', '.')
                    if (s.volume !== 0) s.volume = s.volume.toString().replace(',', '.')
                    if (s.width !== 0) s.width = s.width.toString().replace(',', '.')
                    if (s.height !== 0) s.height = s.height.toString().replace(',', '.')
                    if (s.length !== 0) s.length = s.length.toString().replace(',', '.')
                    let yes = await ProductSize.findOne({
                        where: {productId: id}
                    })
                    if (yes)  {
                        response = ProductSize.update({
                            weight: s.weight,
                            volume: s.volume,
                            width: s.width,
                            height: s.height,
                            length: s.length
                        }, {where: { productId: id }})
                    }else {
                        response = ProductSize.create({
                            weight: s.weight,
                            volume: s.volume,
                            width: s.width,
                            height: s.height,
                            length: s.length,
                            productId: id
                        })
                    }
                }else {
                    response = ProductSize.destroy({
                        where: {productId: id}
                    })
                }  
            }
    
            return res.json(response) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода editSizes!'));
        }
    }

    async editOnArticle(req, res, next) {
        try {
            const {article} = req.params
            const body = req.body
            const response = await Product.update(body, {
                where: { article }
            })
            return res.json(response) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода editOnArticle!'));
        }
    }

    async editAll(req, res, next) {
        const {id} = req.params
        try {
            let { name, price, brandId, categoryId, info, have, article, description, promo, country, size, equipment, request } = req.body
            let files
            let imgBig, imgSmall, fileName
            let link = ''

            const brand = await Brand.findOne({
                where: {id: brandId}
            })                
            const product = await Product.findOne({
                where: {id}
            })
            
            let img = product.img

            if (product.article !== article) {
                // deleteOldFiles(brand.name.toLowerCase(), article)
                let ok = renameFolder(brand.name.toLowerCase(), product.article, article)

                if (ok) {
                    img = img.replace(new RegExp(`/${product.article}/`,'g'), `/${article}/`)
                }else {
                    article = product.article
                }
            }

            if (req.files && (req.files.image1 || req.files.image2 || req.files.image3 || req.files.image4)) {   
                
                if (img === "[{}]") createFoldersAndDeleteOldFiles(brand.name.toLowerCase(), article)

                img = JSON.parse(img)

                for(let i = 0; i < 4; i++) {

                    switch(i) {
                        case 0: 
                            if (req.files.image1) { 
                                imgBig = req.files.image1
                            }else { 
                                if(img[i].big !== undefined) link += "," + JSON.stringify(img[i])
                                continue
                            } 
                        break;
                        case 1: 
                            if (req.files.image2) { 
                                imgBig = req.files.image2; 
                                link += ","; 
                            }else { 
                                if(img[i].big !== undefined) link += "," + JSON.stringify(img[i])
                                continue; 
                            } 
                        break;
                        case 2: 
                            if (req.files.image3) { 
                                imgBig = req.files.image3; 
                                link += ","; 
                            }else { 
                                if(img[i].big !== undefined) link += "," + JSON.stringify(img[i])
                                continue; 
                            } 
                        break;
                        case 3: 
                            if (req.files.image4) { 
                                imgBig = req.files.image4; 
                                link += ","; 
                            }else {
                                if(img[i].big !== undefined) link += "," + JSON.stringify(img[i])
                                continue;
                            } 
                        break;
                        default: break;
                    }
                    
                    imgSmall = imgBig
                    
                    fileName = uuid.v4() + '.jpg'

                    imgBig.mv(path.resolve(__dirname, '..', 'static', brand.name.toLowerCase(), article, 'big', fileName))
                    imgSmall.mv(path.resolve(__dirname, '..', 'static', brand.name.toLowerCase(), article, 'small', fileName))
                    
                    link = link + `{"big": "${brand.name.toLowerCase()}/${article}/big/${fileName}", "small": "${brand.name.toLowerCase()}/${article}/small/${fileName}"}`

                }

                files = `[${link}]`

            }else if (!files) {
                files = img
            }

            let url = translit(name) + "_" + article.toString()

            let response = await Product.update(
                {name, url, price, have, article, description, promo, equipment, country, brandId, categoryId, img: files, request}, 
                {where: { id }}
            )

            if (info) {

                let oldInfo = await ProductInfo.findAll({
                    where: {productId: id}
                })

                let inf = JSON.parse(info)
                if (inf && Array.isArray(inf)) {

                    inf.forEach(newI => {
                        let idInfo = 0
                        if (oldInfo && Array.isArray(oldInfo)) {
                            oldInfo.forEach(oldI => {
                                if (newI.title === oldI.title) {
                                    idInfo = oldI.id
                                }
                            })
                        }
                        if (idInfo === 0) {
                            ProductInfo.create({
                                title: newI.title,
                                body: newI.body,
                                productId: id 
                            })
                        }else {
                            ProductInfo.update({ body: newI.body }, { where: { id: idInfo } })
                        }
                    })

                }else {
                    await ProductInfo.destroy({
                        where: {productId: id}
                    })
                }

            }else {
                await ProductInfo.destroy({
                    where: {productId: id}
                })
            }
    
            if (size) {
                let s = JSON.parse(size)
                if (s.weight || s.volume || s.width || s.height || s.length) {
                    if ( ! s.volume && s.width && s.height && s.length ) s.volume = ((s.width * s.height * s.length)/1e9).toFixed(4)
                    if (s.weight !== 0) s.weight = s.weight.toString().replace(',', '.')
                    if (s.volume !== 0) s.volume = s.volume.toString().replace(',', '.')
                    if (s.width !== 0) s.width = s.width.toString().replace(',', '.')
                    if (s.height !== 0) s.height = s.height.toString().replace(',', '.')
                    if (s.length !== 0) s.length = s.length.toString().replace(',', '.')
                    let yes = await ProductSize.findOne({
                        where: {productId: id}
                    })
                    if (yes)  {
                        ProductSize.update({
                            weight: s.weight,
                            volume: s.volume,
                            width: s.width,
                            height: s.height,
                            length: s.length
                        }, {where: { productId: id }})
                    }else {
                        ProductSize.create({
                            weight: s.weight,
                            volume: s.volume,
                            width: s.width,
                            height: s.height,
                            length: s.length,
                            productId: id
                        })
                    }
                }else {
                    ProductSize.destroy({
                        where: {productId: id}
                    })
                }  
            }else {
                ProductSize.destroy({
                    where: {productId: id}
                })
            }  
    
            return res.json(response)
            // return res.json("files " + files)

        }catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async editRating(req, res, next) { // для рейта отдельная функция из-за проверки роли юзера вместо администратора
        try {
            const {id} = req.params
            const {rating} = req.body
            const response = await Product.update({rating}, {
                where: { id }
            })
        return res.json(response) // return boolean
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода editRating!'));
        }
    }


    async getPrice(req, res, next) {
        try {
            const {id} = req.params
            const product = await Product.findOne({ where: { id } })
    
            return res.json(product.price)
            
        }catch(e) {
            return next(res.json({error:'Ошибка метода getPrice!'}))
        }
    }


    async getPromo(req, res, next) {
        try {
            const products = await Product.findAll({ 
				where: { 
					promo: {
						[Sequelize.Op.ne]: ""
					} 
				} 
			})
    
            return res.json(products)
            
        }catch(e) {
            return next(res.json({error:'Ошибка метода getPromo!'}))
        }
    }
	

    async temp(req, res, next) {
        try {
            
            return res.json("temp")

        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода temp!'));
        }
    }

}

module.exports = new ProductController()