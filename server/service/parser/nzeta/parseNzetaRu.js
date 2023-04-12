
const axios = require('axios')
const parseHtml = require('../../html/parseHtml')
const Category = require('../../../models/Category')
const translit = require('../../translit')
const CategoryInfo = require('../../../models/CategoryInfo')
const saveImageCategory = require('./parseNzetaRu/saveImageCategory')
const Product = require('../../../models/Product')
const getProductPage = require('./parseNzetaRu/getProductPage')
const ProductInfo = require('../../../models/ProductInfo')
const getPrice = require('./parseNzetaRu/getPrice')


module.exports = class ParseNzetaRu {
    
    static products = []
    // static categories = []
    // static prices = []
    
    constructor() {
    }

    // *****************************************************
    // стартовый метод
    async run() {
        // сначала получим список товаров
        let url = process.env.URL + "/api/parser/nzeta?method=items" 
        let response = await axios.get(url)
        this.products = response.data        
        // let article = this.products[0].artikul // "zeta21923", "zeta41810"
        // this.products = [{artikul: "zeta21923"},{artikul: "zeta41810"}] // тестовая запись
        return this.products
    }

    // *****************************************************
    // поиск и добавление всех категорий заданного номера (из списка товаров), 
    // либо можно передать артикул вместо number и пометить => numberIsArticle = true
    async getCategories(number, numberIsArticle = false) {
        let article

        if (numberIsArticle) article = number
        else article = this.products[number-1].artikul

        // страица товара
        let url = await getProductPage(article)

        let { data } = await axios.get(url)
                
        let response = parseHtml(data, {
            start: `<ul class="breadcrumb"`,
            end: `</ul>`
        })

        data = { rest: response }
        
        // создаём массив категорий
        let array = []
        let title
        try {
            while(1) {
                data = parseHtml(data.rest, {
                    start: `<a href="`,
                    end: `"`,
                    return: true
                })                
                title = parseHtml(data.rest, {
                    start: `title="`,
                    end: `"`
                })
                array.push({url: "https://nzeta.ru" + data.search, title})
            }
        }catch(e){
            // console.log("exception: ", e)
            // console.log("catch data: ", data)
        }
        
        // родительская категория изначально равна 0
        let parent_category = 0        
        let categoryInfoId = null

        // перебираем массив категорий
        for (let item = 0; item < array.length; item++) {
            title = array[item].title
            url = array[item].url

            if ( ! title ) continue
            if (title === "Каталог") continue

            let category = await Category.findOne({
                where: {
                    name: title
                    // name: "Акции"
                }
            })

            // если такая категория существует
            if ( category ) {
                // сохраняем эту категорию как родительскую
                parent_category = category.id
                continue
            }

            // если нет категории, тогда создаём
            if ( ! category ) {  
                
                response = await axios.get(url)

                data = response.data

                response = null
                
                try {
                    response = parseHtml(data, {
                        entry: `<div class="h4 hidden-xs">`,
                        start: `Технические`,
                        end: `характеристики`
                    })
                }catch(e) {}

                // если на странице есть 'Технические характеристики'
                if (response !== null) { 
                    //--------------------------------------------------------------
                    // получаем характеристики
                    let characteristics = []
                    try {
                        response = parseHtml(data, {
                            entry: `id="tech"`,
                            start: `<table class="table">`,
                            end: `</table>`
                        })
                        response = { rest: response }
                        let search, name, value
                        /* 
                        В table есть много tr, в каждой tr есть пара td
                        достаём из td название (name) и значение (value)
                        */
                        while(1) {                 
                            response = parseHtml(response.rest, {
                                start: `<tr`,
                                end: `</tr>`,
                                return: true
                            })
                            search = response.search
                            // из первых td убираем иконки
                            search = parseHtml(search, {
                                entry: `<td>`,
                                start: `">`,
                                end: `</td>`,
                                return: true
                            })
                            name = search.search.trim()
                            name = name.replace("&nbsp;","").replace("&nbsp","")
                            search = parseHtml(search.rest, {
                                start: `<td>`,
                                end: `</td>`
                            })
                            value = search.trim()
                            characteristics.push({name,value})
                        }
                    }catch(e) {}
                    if (characteristics !== []) {
                        characteristics = JSON.stringify(characteristics)
                    }else {
                        characteristics = null
                    }
                    //--------------------------------------------------------------
                    // получаем изображения
                    let image = null // { path: "", files: ["1.jpg", "2.jpg"] }
                    let files = []
                    let item = 1
                    let stringImage = null // строка содержащая путь до папки с изображениями
                    response = parseHtml(data, {
                        start: `id="nav-product-slider"`,
                        end: `Подбор по параметрам`
                    })
                    response = { rest: response }
                    try {
                        while(1) {
                            response = parseHtml(response.rest, {
                                start: `<img src="`,
                                end: `"`,
                                return:  true
                            })
                            // удаляем из ссылки лишнее (получается вместо маленького изображения - большое)
                            response.search = response.search
                                .replace("/resize_cache", "")
                                .replace("/492_300_1", "")
                                .replace("/120_120_1", "")
                                .replace("/608_608_1", "")

                            url = "https://nzeta.ru" + response.search
                            // return data
                            
                            try {
                                stringImage = await saveImageCategory(url, title, item) // item = 1 - file name
                                files.push(`${item}.jpg`)
                                item++
                            }catch(e) {
                                // console.log("exception: ", e)
                                // console.log("catch response: ", response)
                            }             
                        }
                    }catch(e) {                        
                        // console.log("exception: ", e)
                        // console.log("catch response: ", response)
                    }                    
                    if (files !== [] && stringImage) {
                        image = { path: stringImage, files }
                        image = JSON.stringify(image)
                    }
                    // return image
                    //--------------------------------------------------------------
                    // получаем описание
                    let description
                    try {
                        response = parseHtml(data, {
                            start: `<div class="description">`,
                            end: `</div>`,
                            inclusive: true
                        })
                        description = response.trim()
                        if (description.length > 4095) {
                            description = null
                            console.error(`У категории '${title}' description.length > 4095`)
                        }
                    }catch(e) {}

                    // сохраняем в базу характеристики, описания и изображение
                    let categoryInfo = await CategoryInfo.create({
                        title,
                        description,
                        characteristics,
                        documents: null,
                        image
                    })
                    categoryInfoId = categoryInfo.id
                }

                // сохраняем в базу новую категорию
                category = await Category.create({
                    name: title,
                    url: translit(title),
                    is_product: 0,
                    sub_category_id: parent_category,
                    categoryInfoId
                })

                // делаем текущую категорию родительской
                parent_category = category.id
                categoryInfoId = null
            }
        }

        // записываем в базу то, что категория содежит товары
        await Category.update({ is_product: 1 }, {
            where: { id: parent_category }
        })
    
        // возвращаем номер последней категории в которой лежит товар
        return parent_category
    }


    // *****************************************************
    // добавление товара заданного номера (из списка товаров)
    async getProduct(number, numberIsArticle = false) {
        let article

        if (numberIsArticle) article = number
        else article = this.products[number-1].artikul
        
        let productId
        
        let product = await Product.findOne({
            where: {
                article
            }
        })

        if ( product ) {
            productId = product.id
        }
        
        // если нет такого товара, тогда создаём
        if ( ! product ) {

            let url = await getProductPage(article)

            let { data } = await axios.get(url)

            let title = parseHtml(data, {
                start: `<h1 id="pagetitle">`,
                end: `</h1>`
            })
            // return title

            let response = null
            
            try {
                response = parseHtml(data, {
                    entry: `<div class="h4 hidden-xs">`,
                    start: `Технические`,
                    end: `характеристики`
                })
            }catch(e) {}

            // если на странице есть 'Технические характеристики'
            if (response !== null) { 
                //--------------------------------------------------------------
                // получаем характеристики
                let characteristics = []
                try {
                    response = parseHtml(data, {
                        entry: `id="tech"`,
                        start: `<table class="table">`,
                        end: `</table>`
                    })
                    response = { rest: response }
                    let search, name, value
                    /* 
                    В table есть много tr, в каждой tr есть пара td
                    достаём из td название (name) и значение (value)
                    */
                    while(1) {                 
                        response = parseHtml(response.rest, {
                            start: `<tr`,
                            end: `</tr>`,
                            return: true
                        })
                        search = response.search
                        // из первых td убираем иконки
                        search = parseHtml(search, {
                            entry: `<td>`,
                            start: `">`,
                            end: `</td>`,
                            return: true
                        })
                        name = search.search.trim()
                        name = name.replace("&nbsp;","").replace("&nbsp","")
                        search = parseHtml(search.rest, {
                            start: `<td>`,
                            end: `</td>`
                        })
                        value = search.trim()
                        characteristics.push({name,value})
                    }
                }catch(e) {}
                if (characteristics !== []) {
                    characteristics = JSON.stringify(characteristics)
                }else {
                    characteristics = null
                }

                // return  characteristics

                let categoryId = await this.getCategories(number, numberIsArticle)

                let object = await getPrice(article)

                let price = object.price

                let have = false
                if (object.остаткиМосква + object.остаткиНовосиб) have = true

                // сохраняем в базу новый товар
                product = await Product.create({
                    name: title,
                    url: translit(title),
                    price,
                    rating: 0,
                    img: "in category",
                    have,
                    article,
                    promo: null,
                    country: null,
                    request: false, 
                    categoryId,
                    brandId: 1 // nzeta
                })

                productId = product.id 
                
                await ProductInfo.create({
                    title: "Характеристики",
                    body: characteristics,
                    productId
                })

            }
            
        }

        let message = `Артикул '${article}' добавлен! Его id: ${productId}.`

        let response = {
            id: productId,
            article,
            message
        }
      
        return message // response
    }


    // *****************************************************
    // эхо
    async getEcho() {        
        return { echo: "ok" }
    }    

}
