
const axios = require('axios')
const parseHtml = require('../../html/parseHtml')


module.exports = class ParseKvtSu {
    
    static catalog = []
    static products = []
    static prices = []
    
    constructor() {
    }

    async run() {
        let { data } = await axios.get("https://kvt.su/prod/")

        data = parseHtml(data, {
            start: `<div class="widget widget-collapsible">`,
            end: `</div>`
        })

        let array = []
        try {
            while(true) {
                let { rest, search } = parseHtml(data, {
                    entry: `<li class="with-ul ">`,
                    start: `<ul>`,
                    end: `</ul>`,
                    return: true
                })
                
                try {
                    while(true) {
                        let response = parseHtml(search, {
                            start: `<a href="`,
                            end: `">`,
                            return: true
                        })
                        search = response.rest

                        array.push("https://kvt.su" + response.search)
                    }
                }catch(e) {}

                data = rest
            }
        }catch(e) {
            if (array[0] === undefined) throw `Не смог найти данные каталога, это печально.©` // ${e}`
        }

        this.catalog = array

        return true
    }

    // вывод всех ссылок каталога
    async getCatalog(number) {
        if (number) return this.catalog[number - 1]

        return this.catalog
    }

    // количество ссылок в каталоге
    async getLengthCatalog() {
        return this.catalog.length
    }
    
    // 
    async getProducts(catalog, product) {

        if (! catalog) throw `Не задан номер позиции каталога!`

        let { data } = await axios.get(this.catalog[catalog - 1])
        
        data = parseHtml(data, {
            start: `<div class="row cols-2 cols-sm-4 product-wrapper">`,
            end: `</main>`
        })
        
        let array = []
        try {
            while(true) {
                let { rest, search } = parseHtml(data, {
                    entry: `<figure class="product-media">`,
                    start: `<a href="`,
                    end: `">`,
                    return: true
                })
                array.push("https://kvt.su" + search)

                data = rest
            }
        }catch(e) {
            if (array[0] === undefined) throw `Не смог найти данные списка товаров, это печально.©` // ${e}`
        }

        this.products = array

        if (product) return this.products[product - 1]

        return this.products
    }
    
    // 
    async getLengthProducts(catalog) {

        if (! catalog) throw `Не задан номер позиции каталога.`

        this.products = await this.getProducts(catalog) 

        return this.products.length
    }

    // 
    async getPrices(catalog, product) {

        if (! catalog) throw `Не задан номер позиции каталога!!!`
        if (! product) throw `Не задан номер позиции товара в каталоге!!!`

        let url = await this.getProducts(catalog, product)

        let { data } = await axios.get(url)
        
        data = parseHtml(data, {
            entry: `<table class="table-light">`,
            start: `<tbody>`,
            end: `</tbody>`
        })
        
        let array = []
        try {
            while(true) {
                let article = parseHtml(data, {
                    entry: `<td data-id="sku">`,
                    start: `<label class="badge sku">`,
                    end: `</label>`
                })
                let quantity = parseHtml(data, {
                    start: `<td data-id="issue_norm">`,
                    end: `</td>`
                })
                let { rest, search } = parseHtml(data, {
                    start: `<td class="price" data-id="trade_price_small">`,
                    end: `</td>`,
                    return: true
                })
                array.push({ article, price: search, quantity })

                data = rest
            }
        }catch(e) {
            if (array[0] === undefined) throw `Не смог найти данные списка товарных позиций, это печально.©` // ${e}`
        }

        this.prices = array

        return this.prices
    }

}

EXAMPLE = `
<li class="with-ul ">
    <a class="" href="/prod/cable-lugs/">
        Силовые кабельные наконечники и гильзы
    </a>
    <ul>
        <li>
            <a href="/prod/cable-lugs/cu/">
                Медные наконечники и гильзы
            </a>
        </li>
        <li>
            <a href="/prod/cable-lugs/al/">
                Алюминиевые наконечники и гильзы
            </a>
        </li>
        <li>
            <a href="/prod/cable-lugs/al-cu/">
                Медно-алюминиевые наконечники и гильзы
            </a>
        </li>
        <li>
            <a href="/prod/cable-lugs/clamps/">
                Ответвительные сжимы
            </a>
        </li>
    </ul>
</li>`

example_two = `
<figure class="product-media">
    <a href="/prod/cable-lugs/cu/tml/">
        <img src="/images/cms/thumbs/01894aae5ca2a611ecc12d0688bf2ef864128995/tml_490_auto_jpg.jpg" alt="Наконечники кабельные медные луженые (ГОСТ 7386-80)" title="Наконечники кабельные медные луженые (ГОСТ 7386-80)">
    </a>
    <div class="product-label-group"></div>
    <div class="product-action">
        <a href="/prod/cable-lugs/cu/tml/" class="btn-product" title="Quick View">
            Подробнее
        </a>
    </div>
</figure>`