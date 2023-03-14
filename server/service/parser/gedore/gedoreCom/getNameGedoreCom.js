
const parseHtml = require("../../../html/parseHtml")


function getNameGedoreCom(string) {
    
    let response = parseHtml(string, {
        entry: `catalog-element`,
        start: `img src="`,
        end: `"`,
        return: true
    })

    if ( ! response.rest ) throw "Не найдено наименование товара! (getNameGedoreCom)"

    response = parseHtml(response.rest, {
        start: `<h2>`,
        end: `</h2>`
    })
    
    return response
}

module.exports = getNameGedoreCom