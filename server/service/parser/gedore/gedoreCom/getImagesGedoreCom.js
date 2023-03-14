
const parseHtml = require("../../../html/parseHtml")


function getImagesGedoreCom(string) {
    
    let response = parseHtml(string, {
        entry: `catalog-element`,
        start: `img src="`,
        end: `"`
    })
    
    return "http://www.gedore.com.ru" + response
}

module.exports = getImagesGedoreCom