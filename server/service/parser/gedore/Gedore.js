const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const uuid = require('uuid')
let sharp = require('sharp')
const { Brand, Category, Product } = require('../../../models/models')
// const findProductByUrl = require('../../product/findProductByUrl')
const findProductByArticle = require('../../product/findProductByArticle')
const createFoldersAndDeleteOldFiles = require('../../createFoldersAndDeleteOldFiles.js')
const createProduct = require('../../product/createProduct.js')
const translit = require('../../translit.js')
const parseXlsx = require('../../xlsx/parseXlsx')
const getDataGedoreTool = require('./gedoreTool/getDataGedoreTool')
const getImagesGedoreTool = require('./gedoreTool/getImagesGedoreTool')
const getDescriptionGedoreTool = require('./gedoreTool/getDescriptionGedoreTool')
const getNameGedoreTool = require('./gedoreTool/getNameGedoreTool')
const getSizesGedoreCom = require('./gedoreCom/getSizesGedoreCom')
const getDataGedoreCom = require('./gedoreCom/getDataGedoreCom')
const getImagesGedoreCom = require('./gedoreCom/getImagesGedoreCom')
const getDescriptionGedoreCom = require('./gedoreCom/getDescriptionGedoreCom')
const getNameGedoreCom = require('./gedoreCom/getNameGedoreCom')
const ProductDto = require('../../../dtos/productDto')
const saveInfoInFile = require('../../saveInfoInFile')



module.exports = class Gedore {
    
    static product = []
    
    constructor() {
        this.kursEuro = 80
    }

    async run(feed = {}) {
        let fullPath, response

        fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'gedore', 'feed.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'gedore'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'gedore'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'gedore', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 
            
            response = await parseXlsx(fullPath, [ 
                "Gedore Code-Nr.",
                "Artikelbeschreibung",
                "ЕВРО с ндс РРЦ",
            ])
            
            if (response && Array.isArray(response)) {
                this.product = response.map(i => {
                    return {
                        article: i["Gedore Code-Nr."],
                        name: i["Artikelbeschreibung"],
                        price: i["ЕВРО с ндс РРЦ"],
                        category: null,
                    }
                })
                return true
            }
            // response = await parseXlsx(fullPath, [ 
            //     "Code",
            //     "РУС",
            //     "РРЦ с НДС Розница",
            //     "Категории",
            // ])
            
            // if (response && Array.isArray(response)) {
            //     this.product = response.map(i => {
            //         return {
            //             article: i["Code"],
            //             name: i["РУС"],
            //             price: i["РРЦ с НДС Розница"],
            //             category: i["Категории"],
            //         }
            //     })
            //     return true
            // }

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

        let article = one.article
        let name = one.name
        // if (name === "#Н/Д" || name === "42") throw "Не найдено наименование!"
        // let price = one.price
        let price = Math.round( ( one.price * kursEuro ) * 100 ) /100
        let category = one.category
        
        let categoryId = 0

        if (category) { 

            let cat = await Category.findAll()
            cat.forEach(i => {
                if (i.url === category) {
                    categoryId = i.id
                }
            })
            
            if (categoryId === 0) throw "Не найден номер категории!"

        }else {
            categoryId = 157 // category = "ruchnoy-instrument_drugoe"
        }

        // let brand = await Brand.findOne({ where: { name: "Gedore" } })
        let brandId = 3 // brand.id
        if ( ! brandId ) throw "Не найден бренд товара!"
        
        let product = await findProductByArticle("ged" + article)
        
        if (product && product.id !== undefined && product.name != 42) throw "Такой товар уже есть."
        
        let country = "Германия"
        let info = []
        let size, image, description

        size = await getSizesGedoreCom(article)

        try {
            let dataGedoreTool = await getDataGedoreTool(article)
            image = getImagesGedoreTool(dataGedoreTool)
            description = getDescriptionGedoreTool(dataGedoreTool)
            if (name === "42") name = getNameGedoreTool(dataGedoreTool)
        }catch(e) {
            console.log("err: ",e)
            let dataGedoreCom = await getDataGedoreCom(article)
            image = getImagesGedoreCom(dataGedoreCom)
            description = getDescriptionGedoreCom(dataGedoreCom)
            if (name === "42") name = getNameGedoreCom(dataGedoreCom)
        }
        
        let url = translit(name) + "_" + article
        
        if (description) info.push( { title: "description", body: description } )
        
        article = "ged" + article

        let imageName = uuid.v4()  + '.jpg'

        createFoldersAndDeleteOldFiles("gedore", article)

        let imageBig = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'gedore', article, 'big', imageName))
        let imageSmall = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'gedore', article, 'small', imageName))

        if (image.includes("https")) {
            https.get(image, (res) => {
                res.pipe(imageBig)
                res.pipe(sharp().resize(100)).pipe(imageSmall)
            })
        }else {
            http.get(image, (res) => {
                res.pipe(imageBig)
                res.pipe(sharp().resize(100)).pipe(imageSmall)
            })
        }
        

        let files = `[`

        files += `{"big":"gedore/${article}/big/${imageName}","small":"gedore/${article}/small/${imageName}"}`
        
        files += `]`

        return { 
            categoryId,
            brandId,
            article, 
            name,
            url,
            have: 1,
            promo: "",
            country,
            files,
            price,
            size,
            info,
            filter: undefined,
            image
        }
    }

    // добавление товара в БД
    async add(number) {
        try {
            let print = await this.print(number)

            // let { name, url, price, have, article, promo, country, brandId, categoryId, files, info, size, filter, request } = print

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
        let response = `{<br />`
        
        let brand = await Brand.findOne({ where: { name: "Gedore" } })
        if (brand.id === undefined) return { error: "Не найден бренд товара." }

        let old = await Product.findAll({ where: { brandId: brand.id } })

        if (this.product !== undefined) this.product.forEach(newProduct => {
            if (response !== `{<br />`) response += ",<br />"
            let yes = false
            old.forEach(oldProduct => {
                if (oldProduct.article === `ged${newProduct.article}`) {
                    let newPrice = newProduct.price
                    newPrice = Math.round( ( newPrice * this.kursEuro ) * 100 ) / 100
                    if (newPrice != oldProduct.price) {
                        response += `"${oldProduct.article}": "Старая цена = ${oldProduct.price}, новая цена = ${newPrice}."`
                        Product.update({ price: newPrice },
                            { where: { id: oldProduct.id } }
                        ).then(()=>{
                            // console.log("then")
                        }).catch(()=>{
                            // console.error("catch")
                        })
                    }else {
                        response += `"${oldProduct.article}": "Цена осталась прежняя = ${oldProduct.price}."`
                    }
                    yes = true
                }
            })
            if ( ! yes) response += `"ged${newProduct.article}": "Не найден артикул."` 
        })

        response = response + `<br />}`
        
        saveInfoInFile(brand.name, "update_price", response) 

        return response
    }


}