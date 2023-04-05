
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const https = require('https')
const parseHtml = require('../../html/parseHtml')
const Category = require('../../../models/Category')
const translit = require('../../translit')
const CategoryInfo = require('../../../models/CategoryInfo')


module.exports = class ParseNzetaRu {
    
    static products = []
    static categories = []
    static prices = []
    
    constructor() {
    }

    async run() {
        
        // сначала получим список товаров
        let url = process.env.URL + "/api/parser/nzeta?method=items"
        // let response = await axios.get(url)
        // this.products = response.data        
        // let article = this.products[0].artikul // "zeta21923"

        this.products = [{artikul: "zeta21923"}]

        return true
    }

    // поиск и добавление всех категорий заданного артикула
    async getCategories(number) {
        let article = this.products[number-1].artikul // "zeta21923"
        
        // страница поиска
        let url = "https://nzeta.ru/catalog/?q=" + article

        let { data } = await axios.get(url)

        data = parseHtml(data, {
            entry: `<tr itemprop="itemListElement"`,
            start: `<a href="`,
            end: `" target="_blank"`
        })

        // страица товара
        url = "https://nzeta.ru" + data

        let response = await axios.get(url)


        // сохраняем данные товара в переменную productData
        let productData = response.data

                
        data = parseHtml(productData, {
            start: `<ul class="breadcrumb"`,
            end: `</ul>`
        })
        data = { rest: data }
        
        // массив категорий
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
            console.log("exception: ", e)
            console.log("catch data: ", data)
        }
        
        // родительская категория
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
            // return category

            if ( category ) {
                // сохраняем эту категорию как родительскую
                parent_category = category.id
                continue
            }

            if ( ! category ) {  // если нет категории, тогда создаём
                
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

                if (response !== null) {
                    
                    let characteristics = []
                    try {
                        // характеристики
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
                    // return characteristics

                    let image
                    try {
                        // изображение
                        response = parseHtml(data, {
                            entry: `id="main-product-slider"`,
                            start: `class="fancybox" href="`,
                            end: `"`
                        })
                        url = "https://nzeta.ru" + response

                        image = await this.getImageCategory(url, title)

                        // return image
                    }catch(e) {}

                    let description
                    try {
                        // описание
                        response = parseHtml(data, {
                            start: `<div class="description">`,
                            end: `</div>`,
                            inclusive: true
                        })
                        description = response.trim()

                        if (description.length > 4095) {
                            description = null
                            console.error(`У категории '${title}' description.length > 4095`)
                            // throw `У категории '${title}' description.length > 4095`
                        }

                        // return description.length
                    }catch(e) {}

                    // categoryInfo create
                    let categoryInfo = await CategoryInfo.create({
                        title,
                        description,
                        characteristics,
                        documents: null,
                        image
                    })
                    categoryInfoId = categoryInfo.id
                }

                category = await Category.create({
                    name: title,
                    url: translit(title),
                    is_product: 0,
                    sub_category_id: parent_category,
                    categoryInfoId
                })

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

    // эхо
    async getEcho() {        
        return { echo: "ok" }
    }    

    // 
    async getImageCategory(url, title) {

        let folder = translit(title)
        let brand = 'nzeta'

        if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', brand))){
            try {
                fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', brand))
            }catch(e) {
                console.log(`Создать папку '${brand}' не удалось.`)
            }
        }
        if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', brand, 'category'))){
            try {
                fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', brand, 'category'))
            }catch(e) {
                console.log(`Создать папку 'category' не удалось.`)
            }
        }
        if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', brand, 'category', folder))){
            try {
                fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', brand, 'category', folder))
            }catch(e) {
                console.log(`Создать папку '${folder}' не удалось.`)
            }
        }
                
        let fileName = '1.jpg'
        
        let filePath = '/' + brand + '/category/' + folder + '/' + fileName
        
        let image = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', brand, 'category', folder, fileName))
        
        https.get(url, (res) => {
            res.pipe(image)
        })
    
        return filePath
    }    

}

EXAMPLE = `
<ul class="breadcrumb" id="navigation" itemscope="" itemtype="http://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_0">
        <a href="/" title="" itemprop="item">
            <span itemprop="name"><i class="fa fa-home"></i></span>
        </a>
        <meta itemprop="position" content="1">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_1">
        <a href="/catalog/" title="Каталог" itemprop="item">
            <span itemprop="name">Каталог</span>
        </a>
        <meta itemprop="position" content="2">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_2">
        <a href="/catalog/nakonechniki-gilzy-i-soediniteli/" title="Наконечники, гильзы и соединители" itemprop="item">
            <span itemprop="name">Наконечники, гильзы и соединители</span>
        </a>
        <meta itemprop="position" content="3">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_3">
        <a href="/catalog/nakonechniki-gilzy-i-soediniteli/mednye-tm-l-jg-gm-l-/" title="Медные наконечники и гильзы" itemprop="item">
            <span itemprop="name">Медные наконечники и гильзы</span>
        </a>
        <meta itemprop="position" content="4">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_4">
        <a href="/catalog/nakonechniki-gilzy-i-soediniteli/mednye-tm-l-jg-gm-l-/tm-mednyy-/" title="Т (медные)" itemprop="item">
            <span itemprop="name">Т (медные)</span>
        </a>
        <meta itemprop="position" content="5">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_5" class="active">
        <span itemprop="item"><span itemprop="name">Наконечник медный Т   2,5-4-2,6 ЗЭТАРУС под опрессовку</span></span>
        <meta itemprop="position" content="6">
    </li>
</ul>`

