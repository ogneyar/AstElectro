const parseHtml = require("../../../html/parseHtml")


function getWeightMilTools(string, article) {

    let response

    try {
        let weight = parseHtml(string, {
            entry: `Вес`,
            start: `<span itemprop="value">`,
            end: `</span>`
        })
        response = { weight: weight.trim(), width: 0, length: 0, height: 0, volume: 0 }
    }catch(e) {
        throw `${e} (article: ${article})`
    }

    return response
}

module.exports = getWeightMilTools