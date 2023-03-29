
const axios = require('axios')
const parseHtml = require('../../html/parseHtml')


module.exports = class ParseNzetaRu {
    
    static catalog = []
    static products = []
    static prices = []
    
    constructor() {
    }

    async run() {
        let { data } = await axios.get("https://nzeta.ru/catalog/?q=")

        

        // data = parseHtml(data, {
        //     start: `<div class="widget widget-collapsible">`,
        //     end: `</div>`
        // })

        // let array = []
        // try {
        //     while(true) {
        //         let { rest, search } = parseHtml(data, {
        //             entry: `<li class="with-ul ">`,
        //             start: `<ul>`,
        //             end: `</ul>`,
        //             return: true
        //         })
                
        //         try {
        //             while(true) {
        //                 let response = parseHtml(search, {
        //                     start: `<a href="`,
        //                     end: `">`,
        //                     return: true
        //                 })
        //                 search = response.rest

        //                 array.push("https://kvt.su" + response.search)
        //             }
        //         }catch(e) {}

        //         data = rest
        //     }
        // }catch(e) {
        //     if (array[0] === undefined) throw `Не смог найти данные каталога, это печально.©` // ${e}`
        // }

        // this.catalog = array

        return true
    }

    // поиск и добавление всех категорий заданного артикула
    async getCategories(article) {
        // if (number) return this.catalog[number - 1]

        // return this.catalog
        return { article }
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

