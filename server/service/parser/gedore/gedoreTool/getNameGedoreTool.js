
const parseHtml = require("../../../html/parseHtml")


function getNameGedoreTool(string) {
    
    let response = parseHtml(string, {
        entry: `product-right-block`,
        start: `heading-title">`,
        end: `</h1>`,
    })
    
    let split = response.split(" ")
    if (Number.isInteger(Number(split[0]))) {
        split[0] = ""
        response = split.join(" ").trim()
    }

    return response
}

module.exports = getNameGedoreTool