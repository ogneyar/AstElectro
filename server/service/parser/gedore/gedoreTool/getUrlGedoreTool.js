const axios = require("axios")
const parseHtml = require("../../../html/parseHtml")


async function getUrlGedoreTool(article) {
    
    let Html

    await axios.get('https://gedoretool.ru/search/search', { params: {

        search: article

    } }).then(res => Html = res.data)
        
    if (!Html) throw 'Не сработал axios.get(https://gedoretool.ru/search/search)'
    
    let response = parseHtml(Html, {
        entry: `<div class="image`,
        start: `href="`,
        end: `"`
    })
    
    return response
}

module.exports = getUrlGedoreTool