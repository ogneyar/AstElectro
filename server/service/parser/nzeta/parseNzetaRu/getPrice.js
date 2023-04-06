
const axios = require("axios")

/*
PROPERTY_CML2_ARTICLE_VALUE - артикул
STORE_AMOUNT_4      - остатки на складе в Москве
STORE_AMOUNT_10     - остатки на складе в Новосибирске.
CATALOG_PRICE_OPT   - оптовая цена
*/
const getPrice = async (article) => {
    
    let url = process.env.URL + "/api/parser/nzeta?method=product/getProduct"

    let { data } = await axios.get(url)

    let price = null
    let остаткиМосква = null
    let остаткиНовосиб = null

    data.forEach(item => {
        if (item.PROPERTY_CML2_ARTICLE_VALUE === article)  {
            price = item.CATALOG_PRICE_OPT
            остаткиМосква = item.STORE_AMOUNT_4
            остаткиНовосиб = item.STORE_AMOUNT_10
        }
    })

    return {
        price,
        остаткиМосква,
        остаткиНовосиб
    }

}

module.exports = getPrice
