
const parseHtml = require("../../../html/parseHtml")


function getDescriptionGedoreCom(string) {
    
    let response = parseHtml(string, {
        entry: `widget_title`,
        start: `<ul>`,
        end: `</ul>`,
        inclusive: true
    })
    
    return response
}

module.exports = getDescriptionGedoreCom