const fs = require('fs')
const path = require('path')
const http = require('http')
// const https = require('https')
const uuid = require('uuid')
let sharp = require('sharp')
const { Brand, Category, Product } = require('../../../models/models')
const findProductByArticle = require('../../product/findProductByArticle')
const createFoldersAndDeleteOldFiles = require('../../createFoldersAndDeleteOldFiles.js')
const createProduct = require('../../product/createProduct.js')
const translit = require('../../translit.js')
const parseXlsx = require('../../xlsx/parseXlsx')
const ProductDto = require('../../../dtos/productDto')



module.exports = class Leidtogi {
    
    static product = []
    static number_sheet = 1 // number_sheet - номер вкладки (1 - Абразив, 2 - Алмаз)
    
    constructor() {}

    async run(feed = {}, numberSheet = 1) {

        this.number_sheet = numberSheet

        let fullPath, response

        fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'leidtogi', 'feed.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'leidtogi'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'gedore'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'leidtogi', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 
            
            response = await parseXlsx(fullPath, [
                "Наименование",
                "Артикул",
                "РРЦ",
                "Описание",
                "Характеристики",
                "Категория",
                "Вес",
                "В упаковке",
                "Длина",
                "Высота",
                "Ширина",
                "Объём",
            ], numberSheet) // numberSheet - номер вкладки (1 - абразив, 2 - алмаз)
            
            if (response && Array.isArray(response)) {
                this.product = response.map(i => {
                    return {
                        name: i["Наименование"],
                        article: i["Артикул"],
                        price: i["РРЦ"],
                        description: i["Описание"],
                        characteristics: i["Характеристики"],
                        category: i["Категория"],
                        weight: i["Вес"],
                        in_package: i["В упаковке"],
                        length: i["Длина"],
                        height: i["Высота"],
                        width: i["Ширина"],
                        volume: i["Объём"],
                    }
                })
                return true
            }

        }else {
            throw `Файл ${fullPath} отсутствует или пуст!`
        }

        return false
    }


    // количество записей в feed.xlsx
    async getLength() {
        return this.product.length
    }


    // вывод данных на экран
    async print(number) {

        let one = this.product[number - 1]
        
        let name = one.name 
        // замена русской буквы 'х' на английский 'x' в записи типа: 125х1х32
        name = name.replace(/х(\d+)/g,"x$1")

        let article = one.article

        let url = translit(name) + "_" + article

        let price = Math.round(one.price * 100) / 100

        let description = one.description
        let characteristics = one.characteristics

        let category = one.category
        
        let categoryId = 0
                    
        let cat = await Category.findAll()
        cat.forEach(i => {
            if (i.url === category) {
                categoryId = i.id
            }
        })
        
        if (categoryId === 0) throw "Не найден номер категории!"
        
        let brand = await Brand.findOne({ where: { name: "Leidtogi" } })
        let brandId = brand.id
        if ( ! brandId ) throw "Не найден бренд товара!"
        
        let product = await findProductByArticle(article)
        if (product && product.id !== undefined) throw "Такой товар уже есть."
        
        let country = "Россия"

        let info = []
        if (description) info.push( { title: "description", body: description } )
        if (characteristics) info.push( { title: "characteristics", body: characteristics } )

        let size = {
            weight: one.weight,
            length: one.length,
            height: one.height,
            width: one.width,
            volume: one.volume
        }
                        
        let imageName = uuid.v4()  + '.jpg'

        createFoldersAndDeleteOldFiles("leidtogi", article)

        let img = path.resolve(__dirname, '..', '..', '..', 'static', 'leidtogi', 'images', this.number_sheet, article+".jpg")

        let files = `[`

        if (fs.existsSync(img)) {
            
            let bigFile = path.resolve(__dirname, '..', '..', '..', 'static', 'leidtogi', article, 'big', imageName)
            let smallFile = path.resolve(__dirname, '..', '..', '..', 'static', 'leidtogi', article, 'small', imageName)

            let imageBig = fs.createWriteStream(bigFile)
            let imageSmall = fs.createWriteStream(smallFile)

        
            http.get(`${process.env.URL}/leidtogi/images/${this.number_sheet}/${article}.jpg`, (res) => {
                res.pipe(imageBig)
                res.pipe(sharp().resize(100)).pipe(imageSmall)
            })

            // fs.copyFile(img, bigFile, err => {
            //     if(err) throw err // не удалось скопировать файл
            //     else console.log('Файл успешно скопирован')
            // })

            files += `{"big":"leidtogi/${article}/big/${imageName}","small":"leidtogi/${article}/small/${imageName}"}`
        }else {
            files += `{}`
        }
        
        files += `]`
        

        return {
            categoryId,
            brandId,
            article, 
            name,
            url,
            have: 1,
            promo: `{"our_brand":true}`,
            country,
            files,
            price,
            size,
            info,
            // filter: undefined
        }

    }

    // добавление товара в БД
    async add(number) {
        try {
            let print = await this.print(number)

            // let { name, url, price, have, article, promo, country, brandId, categoryId, files, info, size, filter } = print
        
            let proDto = new ProductDto(print)

            let product = await createProduct(proDto)
            
            let response = `{${number}: ${product.url} - ${product.price}р. (${product.article})}`
            console.log('\x1b[34m%s\x1b[0m', response)

            return response
        }catch(e) {
            let response = `{${number}: ${e.replace("<","&lt;").replace(">","&gt;")}}`
            console.log('\x1b[33m%s\x1b[0m', response)
            return response
        }
    }

    
    // добавление партии товара в БД
    async addParty(number, quantity) {

        if (quantity === 1) return await this.add(number)
        
        let array = []

        for(let i = number; i < number+quantity; i++) {
            let response = await this.add(i)
            array.push(response)
        }
        
        return array

    }


    // смена цен
    async changePrice() {
        let response = `[`
        
        let brand = await Brand.findOne({ where: { name: "Leidtogi" } })
        if (brand.id === undefined) return { error: "Не найден бренд товара." }

        let old = await Product.findAll({ where: { brandId: brand.id } })

        if (this.product !== undefined) this.product.forEach(newProduct => {
            if (response !== `[`) response += ",<br />"
            let yes = false
            old.forEach(oldProduct => {
                if (oldProduct.article === newProduct.article) {
                    let newPrice = newProduct.price
                    newPrice = Math.round(newPrice * 100) / 100
                    if (newPrice != oldProduct.price) {
                       response += `{${oldProduct.article} - Старая цена: ${oldProduct.price}, Новая цена: ${newPrice}}`
                        Product.update({ price: newPrice },
                            { where: { id: oldProduct.id } }
                        ).then(()=>{}).catch(()=>{})
                    }else {
                        response += `{${oldProduct.article} - Цена осталась прежняя: ${oldProduct.price}}`
                    }
                    yes = true
                }
            })
            if ( ! yes) response += `{Не найден артикул: ${newProduct.article}}`
        })

        response = response + `]`

        return response
    }


}