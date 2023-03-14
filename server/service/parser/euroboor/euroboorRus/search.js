
const axios = require('axios')
const parseHtml = require("../../../html/parseHtml")


async function search(article) {

    let html, response
    let url = 'https://euroboor-rus.ru/search/'

    await axios.get(url, { params: {
        search: article
    } }).then(res => html = res.data)
        
    if (!html) throw 'Не сработал axios.get(https://euroboor-rus.ru)'

    if (html.includes("Нет товаров, соответствующих критериям поиска.")) {
        console.log(`\r\nНет товаров, соответствующих критериям поиска.\r\n`)
        throw "Не найдена ссылка на артикул - " + article + " (euroboor-rus.ru)"
    }
    
    response = parseHtml(html, {
        entry: `<div class="image">`,
        start: `href="`,
        end: `"`
    })
    
    return response
}

module.exports = search