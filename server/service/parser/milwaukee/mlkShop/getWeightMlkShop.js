const parseHtml = require("../../../html/parseHtml")


function getWeightMlkShop(string, article) {

    let response

    try {
        let weight = parseHtml(string, {
            entry: `Вес, кг`,
            entryOr: `Общий вес, кг`,
            start: `<td>`,
            end: `</td>`
        })
        response = { weight, width: 0, length: 0, height: 0, volume: 0 }
    }catch(e) {
        throw `${e} (article: ${article})`
    }

    return response
}

module.exports = getWeightMlkShop