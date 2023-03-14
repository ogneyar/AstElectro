
const parseHtml = require("../../../html/parseHtml")


function getImagesGedoreTool(string) {
    
    let response = parseHtml(string, {
        entry: `<a class="thumbnail`,
        start: `href="`,
        end: `"`
    })
    
    return response
}

module.exports = getImagesGedoreTool