
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const querystring = require('querystring')


module.exports = class NzetaAPI {
    
    static url = ""
    static url_2 = ""
    static token = ""

    constructor() {
        this.url = process.env.NZETA_API_URL
        this.url_2 = process.env.NZETA_API_2_URL
        this.token = process.env.NZETA_API_TOKEN
    }

    /*    
    Methods:
        `structure` - команда позволяет получить список всех категорий номенклатуры nZeta
            token, site - обязательные параметры
            id, limit - НЕобязательные
                -= возвращает =-
                id - идентификатор категории
                s_id - внутренний идентификатор категории
                p_id - идентификатор родительской категории
                name - название категории
                site - идентификатор сайта, к которому относится категория
        `structure_description`
            token, site - обязательные параметры
            d_id, limit - НЕобязательные
        `items` - команда позволяет получить информацию о товарах
            token, site - обязательные параметры
            id, guid, parentguid, artikul, TNVED, limit - НЕобязательные
                -= возвращает =-
                id - идентификатор товара 
                name - название товара
                guid - внутренний идентификатор категории товара
                parentguid - внутренний идентификатор родительской категории товара
                artikul - артикул товара
                category - внутренняя категория товара
                TNVED - код товара по ТН ВЭД
                sertRequired - наличие сертификата
                volumeNumerator - объем
                volumeDenominator - внутренний параметр объема
                weightNumerator - вес
                weightDenominator - внутренний параметр веса
                edIzm - единица измерения упаковок
                volumeEdIzm - единица измерения товара
                inPrice - внутренний параметр цены 
                barcode - штрих код
        `items_description`
            token, site - обязательные параметры
            d_id, limit - НЕобязательные
        `purpose_name`
            token, site - обязательные параметры
            id, limit - НЕобязательные
        `items_picture`
            token, site - обязательные параметры
            id, z_id, type, limit - НЕобязательные
        `items_docs` = []
            token, site - обязательные параметры
            id, z_id, type, limit - НЕобязательные
        `mask`
            token, site - обязательные параметры
            id, limit - НЕобязательные
        `properties_group`
            token, site - обязательные параметры
            id, limit - НЕобязательные
        `properties_purpose`
            token, site - обязательные параметры
            id, limit - НЕобязательные
        `properties` = []
            token, site - обязательные параметры
            id, g_id, type, p_type, code, limit - НЕобязательные
        `properties_values`
            token, site - обязательные параметры
            id, p_id, limit - НЕобязательные
        `properties_items`
            token, site - обязательные параметры
            id, item_id, limit - НЕобязательные
        `items_info` = 404 PageNotFound
            token, article - обязательные параметры
    */
    async post({ method, site, limit, id, z_id, d_id, guid, parentguid, artikul, TNVED, type, g_id, p_type, code, p_id, item_id, article }) {
 
        let body = { 
            token: this.token
        }

        if (site) body = {...body, site}
        else body = {...body, site: 2}

        if (limit) body = {...body, limit}
        if (id) body = {...body, id}
        if (z_id) body = {...body, z_id}
        if (d_id) body = {...body, d_id}
        if (guid) body = {...body, guid}
        if (parentguid) body = {...body, parentguid}
        if (artikul) body = {...body, artikul}
        if (TNVED) body = {...body, TNVED}
        if (type) body = {...body, type}
        if (g_id) body = {...body, g_id}
        if (p_type) body = {...body, p_type}
        if (code) body = {...body, code}
        if (p_id) body = {...body, p_id}
        if (item_id) body = {...body, item_id}
        if (article) body = {...body, article}
        
        var post_data = querystring.stringify(body)

        const config = { 
            headers: { 
                "Accept": "*/*",
                'User-Agent': 'AstElectro',
                'Host': 'localhost',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            },
            // rejectUnauthorized: false,
        }
        
        try {
            let { data } = await axios.post(this.url + method + ".php", post_data, config)

            if (data.error) return data.error

            if (method === "items" && ! artikul) 
            {

                let prices = await this.get({method:"product/getProduct"})

                data = data.filter(item => {
                    // if (item.artikul.includes("zeta")) return true
                    for(let i = 0; i < prices.length; i++) {
                        if (prices[i].PROPERTY_CML2_ARTICLE_VALUE === item.artikul) return true
                    }
                    return false
                })
            }

            if (method === "structure" && id) 
            {
                data = data.filter(item => {
                    if (item.id === id) return true
                    return false
                })
                if (!data) data = [{}]
            }

            return data//.length //= 6420
        }catch(e) {
            return e
        }

    }

    
    /*    
    Methods:
        product/getProduct  - цены
        --------------------------
        Response:
            PROPERTY_CML2_ARTICLE_VALUE - артикул
            STORE_AMOUNT_4      - остатки на складе в Москве
            STORE_AMOUNT_10     - остатки на складе в Новосибирске.
            CATALOG_PRICE_OPT   - оптовая цена
        --------------------------
    */
        async get({ method, article }) {
 
            const query = article ? `?article=${article}` : ""
            
            try {
                // console.log(this.url_2 + method + query)
                let { data } = await axios.get(this.url_2 + method + query)
    
                if (data.error) return data.error
    
                return data.result//.length //= 4090
            }catch(e) {
                return e
            }
    
        }

}
