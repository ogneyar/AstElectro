
const axios = require("axios")
const needle = require('needle')
const parseHtml = require("../../../html/parseHtml")


async function getDataGedoreCom(article) { 
    
    let Html, response

    await axios.get('http://www.gedore.com.ru/search/', { params: {
        q: article
    } }).then(res => Html = res.data)
        
    if (!Html) throw 'Не сработал axios.get(http://www.gedore.com.ru)'
    
    response = parseHtml(Html, {
        entry: `<form action="" method="get">`,
        start: `href="`,
        end: `"`,
        return: true
    })

    if ( ! response.search.includes("catalog")) { // если url НЕ содержит "catalog"
        response = parseHtml(response.rest, { // то ищем далее
            start: `href="`,
            end: `"`
        })
        if ( ! response.includes("catalog") ) throw "Не найдена ссылка товара! (getDataGedoreCom)"
    }else {
        response = response.search
    }

    // await axios.get("http://www.gedore.com.ru" + response).then(res => response = res.data)
    
    await needle('get', "http://www.gedore.com.ru" + response)
        .then(res => response = res.body)

    return response
}

module.exports = getDataGedoreCom