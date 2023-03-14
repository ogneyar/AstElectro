
const parseHtml = require("../../../html/parseHtml")


function getDescriptionGedoreTool(string) {
    
    let response = parseHtml(string, {
        entry: `tab-description`,
        start: `</dd>`,
        end: `</div>`
    })
    
    return "<div>" + response + "</div>"
}

module.exports = getDescriptionGedoreTool