const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const axios = require('axios')
const http = require('http')
const https = require('https')
const uuid = require('uuid')

const { Brand, Category, Product } = require('../../../models/models')

const getArticle = require('./getArticle')
const getImages = require('./getImages')
const getProducts = require('../../csv/parseCsv')

const createFoldersAndDeleteOldFiles = require('../../createFoldersAndDeleteOldFiles.js')
const findProductByArticle = require('../../product/findProductByArticle.js')
const createProduct = require('../../product/createProduct.js')
const translit = require('../../translit.js')
const ProductDto = require('../../../dtos/productDto')



module.exports = class RGK {
    
    static url
    static category = []
    static product = []

    
    constructor() {
        this.url = process.env.RGK_FEED_URL
    }

    async update() { // не работает (редирект на стороне сервера)
        let feed = path.resolve(__dirname, '..', '..', '..', 'prices', 'rgk', 'feed.csv')
        // let file = fs.createWriteStream(feed)
        return await new Promise((resolve, reject) => {
            try {
                http.get(this.url, res => {
                    res.pipe(fs.createWriteStream(feed))
                    res.on("end", () => {
                        console.log("Записал данные в файл feed.csv")
                        resolve(true)
                    })
                })
            }catch(e) {
                console.log("Не смог записать данные в файл feed.csv")
                console.log(" ")
                console.log(e);
                resolve(false)
            }
        })
    }

    async run(update) {
        let response, fullResponse, yes, feed

        if (update) {
            response = await this.update()
        }

        feed = path.resolve(__dirname, '..', '..', '..', 'prices', 'rgk', 'feed.csv') 
        // console.log("fullResponse: ",fullResponse);
        if (fs.existsSync(feed) && iconv.decode(fs.readFileSync(feed), 'win1251') !== "") {
            fullResponse = fs.readFileSync(feed)
        }else {
            return { error: "Файл rgk/feed.csv отсутствует или пуст!" }
        }
        
        // Convert from an encoded buffer to a js string.
        fullResponse = iconv.decode(fullResponse, 'win1251')
        
        fullResponse = fullResponse
            .replace(/(&amp;)/g, "&")
            .replace(/(&amp;)/g, "&")
            .replace(/(&quot;)/g, "\'\'")
            .replace(/(&Prime;)/g, "\`")
            .replace(/(&rdquo;)/g, "\`\`")
            .replace(/(&lt;)/g, "<")
            .replace(/(&gt;)/g, ">")

        response = fullResponse.split('\n')

        // поиск категорий
        yes = false
        this.category = response.map(i => {
            let text = i.split(";")
            if (text[0] === `"category id"`) {
                yes = true
            }else if (text[0] === `"offer id"`) {
                yes = false
            }else if (yes) {
                return {id: text[0], name: text[1].replace(/\"/g, "").replace(/(\r)/g, "")}
            }
            return null
        }).filter(j => j !== null)


        // поиск товаров
        response = getProducts(fullResponse)
        if (response.error !== undefined) {
            return response
        }
        this.product = response.message

        return true
    }

    // вывод данных
    async print(action = "product") {
        let stringResponse
        if (action === "product") {
            stringResponse = this.product
        }else if (action === "category") {
            stringResponse = this.category
        }
        return stringResponse
    }

    // вывод суммы общего количества товара
    async getLengthProducts() {
        return this.product.length
    }

    // поиск данных (поочерёдное, от 1 до getLengthProducts)
    async search(number = 1, info = "full") {
        if ( ! this.product ) return { error: "Ошибка: нет данных о товарах!" }
        if (number > this.product.length) return { error: "Ошибка: такого номера не существует!" }
        
        // if ( ! this.product[number - 1]['available']) return "Нет в наличии"
        let object = {}
        
        object.id = this.product[number - 1]['offer id']
        // object.available = this.product[number - 1]['available']
        // object.name = this.product[number - 1]['offer name']
        object.name = this.product[number - 1]['offer full_name']
        // object.type = this.product[number - 1]['offer type']
        // object.vendor = this.product[number - 1]['offer vendor']
        object.url = this.product[number - 1]['offer url'] + "/"
        object.price = this.product[number - 1]['offer price']
        // object.picture = this.product[number - 1]['offer picture']

        let characteristics
        if (this.product[number - 1]['offer param']) {
            characteristics = this.product[number - 1]['offer param'].split("; ")
            object.characteristics = "<tbody>" + characteristics.map(i => {
                return "<tr>" + i.replace(" - ", "#@").split("#@").map(j => {
                    return "<td>" + j.replace(/\?/g, "&lt;=") + "</td>"
                }).join("") + "</tr>"
            }).join("") + "</tbody>"
        }
        
        if (this.product[number - 1]['offer description']) {
            object.description = this.product[number - 1]['offer description'].replace(/(\r\n)/g, "")
        }

        // object.instructions = this.product[number - 1]['offer instructions']
        // object.certificates = this.product[number - 1]['offer certificates']
        let categoryId = this.product[number - 1]['offer category']
        
        this.category.forEach(i => {
            if (i.id === categoryId) object.category = i.name
        }) 
        
        if ( ! object.category ) {
            if ( ! categoryId ) object.category = "НЕ НАЙДЕНА"
            else object.category = categoryId
        }
        
        let html
        // console.log("object.url: ",object.url)
        await axios.get(object.url.replace(/(:443)/g, ""))
            .then(res => html = res.data)

        let images = getImages(html)
        if (images.error !== undefined) {
            return images
        }
        object.images = images.message

        let article = getArticle(html)
        if (article.error !== undefined) {
            console.log(article.error)
            // return article
            article.message = object.id
        }
        object.article = article.message

        // { id, name, url, price, characteristics, description, category, images, article }
        if (info === "full") return object 
        else return object[info]
        
    }

    // 
    async add(number) {

        let object = await this.search(number) // object = { id, name, url, price, characteristics, description, category, images, article }
        // необходимо добавить { brandId, categoryId, have, country, files, info }

        if (object.error !== undefined) return object

        // преобразуем объект object
        let { name, price, characteristics, description, category, images, article } = object

        article = "rgk" + article

        let prod = await findProductByArticle(article)
        if (prod) {
            console.log("Такой товар уже есть: ",article)
            return "Такой товар уже есть!" // если необходимо обновить товары, то эту строчку надо закомментировать
        }

        if (characteristics) 
            characteristics = characteristics
                .replace(/(<tr><td><\/td><\/tr>)/g, "")
                .replace(/(<tr><td> <\/td><\/tr>)/g, "")
                .replace(/(<tr><td>  <\/td><\/tr>)/g, "")
                .replace(/(<tbody><\/tbody>)/g, "")

        let brand
        try {
            brand = await Brand.findOne({
                where: {name: "RGK"}
            })
        }catch(e) {
            return { error: "Ошибка: бренд не найден!!!" }
        }
        let brandId

        if (brand.id !== undefined) brandId = brand.id
        else return { error: "Ошибка: бренд не найден!" }
        
        let categoryClass
        try {
            categoryClass = await Category.findOne({
                where: {name: category}
            })
        }catch(e) {
            return { error: "Ошибка: категория " + category + " не найдена!!!" }
        }
        
        let categoryId
        
        if (categoryClass.id !== undefined) categoryId = categoryClass.id
        else return { error: "Ошибка: категория не найдена!" }
        
        createFoldersAndDeleteOldFiles("rgk", article)

        let link = ""
        images.forEach(i => {
            let fileName = uuid.v4() + '.jpg'
            
            let file = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'rgk', article, 'big', fileName))
            let file2 = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'rgk', article, 'small', fileName))
            https.get(i, function(res) {
                res.pipe(file)
                res.pipe(file2)
            })

            link = link + `{"big": "rgk/${article}/big/${fileName}", "small": "rgk/${article}/small/${fileName}"},`
        })

        let files = `[${link.replace(/.$/g, "")}]`

        let info = []
        if (description) info.push({title:"description",body:description})
        if (characteristics) info.push({title:"characteristics",body:characteristics})

        let country = "Россия"

        let have = 1

        let promo = undefined
        
        let size = undefined
        
        let urlTranslit = translit(name) + "_" + article.toString()

        // console.log(" ");
        // console.log("id",id);
        // console.log(" ");
        
        // response = { name, url: urlTranslite, price, have, article, promo, country, brandId, categoryId, files, info, size }
        
        let product
        try {
            let proDto = new ProductDto({name, urlTranslit, price, have, article, promo, country, brandId, categoryId, files, info, size})
            product = await createProduct(proDto)
        }catch(e) {
            return { error: "Ошибка: не смог добавить товар!!!" }
        }

        return product
    }

    // смена цены
    async changePrice(number) {

        let article, price, response
            
        await axios.get(this.product[number - 1]["offer url"].replace(/(:443)/g, "") + "/")
            .then(res => article = getArticle(res.data))
        if (article.error !== undefined) article = "rgk" + this.product[number - 1]["offer id"]
        else article = "rgk" + article.message

        price = this.product[number - 1]["offer price"]

        // ---------------------
        // Саня попросил завысить цену на 30%
        // ---------------------
        // price = Number(price) * 1.3 // позже сказал ненадо
        // console.log("price", price)

        const product = await Product.findOne({
            where: { article }
        })
        if (product) {
            if (Number(price) === Number(product.price)) return `"${article}": "Цена осталась прежняя = ${price}."`
            response = await Product.update({ price }, {
                where: { id: product.id }
            })
        }else {
            return `"${article}": "Не найден артикул."`
        }
        
        // if (response) return { article, oldPrice: product.price, newPrice: price }
        if (response) return `"${article}": "Старая цена = ${product.price}, новая цена = ${price}."`
    }


}