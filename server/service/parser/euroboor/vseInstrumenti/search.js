
const axios = require('axios')
const parseHtml = require("../../../html/parseHtml")


async function search(article) {

    let Html, response
    let url = 'https://rostov.vseinstrumenti.ru/search_main.php'

    await axios.get(url, { params: {
        what: "euroboor " + article
    } }).then(res => Html = res.data)
        
    if (!Html) throw 'Не сработал axios.get(https://rostov.vseinstrumenti.ru)'
    
    response = parseHtml(Html, {
        entry: `<div class="image">`,
        start: `href="`,
        end: `"`
    })

    let testArticle = article
        .replace(".", "-")
        .replace("/", "-")
        .replace("+", "")
        .toLowerCase()
    let flag = response.includes(testArticle)
    if ( ! flag) {
        console.log(`\r\n ${response} \r\n`)
        throw "Не найдена ссылка на артикул - " + article + " (vseinstrumenti.ru)"
    }

    return "https://rostov.vseinstrumenti.ru" + response
}

module.exports = search
