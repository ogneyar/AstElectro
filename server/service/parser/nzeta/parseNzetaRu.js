
const axios = require('axios')
const parseHtml = require('../../html/parseHtml')
const Category = require('../../../models/Category')
const translit = require('../../translit')


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

        data = response.data
                
        data = parseHtml(data, {
            start: `<ul class="breadcrumb"`,
            end: `</ul>`
        })
        
        // массив категорий
        let array = []
        let title
        data = { rest: data }
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

            const categories = await Category.findOne({
                where: {
                    name: title
                }
            })

            if ( ! categories ) {  // если нет категории, тогда создаём
                // return {title,url}
                return categories
                
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
                    // categoryInfo create
                    console.log("\n\nТехнические характеристики\n\n");
                }
                console.log("\n\nНЕЕЕЕТ Технические характеристики\n\n");

                // await Category.create({
                //     name: title,
                //     url: translit(title),
                //     is_product: 0,
                //     sub_category_id: parent_category,
                //     categoryInfoId
                // })

            }
        }
    

        // return categories

        // return await Category.findAll()

        return this.categories || null
    }

    // эхо
    async getEcho() {        
        return { echo: "ok" }
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

