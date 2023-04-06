
const axios = require('axios')
const parseHtml = require('../../../html/parseHtml')


const getProductPage = async (article) => {

    // страница поиска
    let url = "https://nzeta.ru/catalog/?q=" + article

    let { data } = await axios.get(url)
    data = parseHtml(data, {
        entry: `<tr itemprop="itemListElement"`,
        start: `<a href="`,
        end: `" target="_blank"`
    })

    // страница товара
    url = "https://nzeta.ru" + data

    return url
}

module.exports = getProductPage
