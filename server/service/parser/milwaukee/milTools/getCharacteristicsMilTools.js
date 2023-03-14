const parseHtml = require("../../../html/parseHtml")


function getCharacteristicsMilTools(string, article) {

    let response

    try{
        response = parseHtml(string, {
            entry: `<div class="detail-props-block`,
            // inclusive: true,
            start: `<table class="props_list nbg">`,
            end: `</table>`
        })
    }catch(e) {
        return { error: `${e} (article: ${article})`}
        // throw `${e} (article: ${article})`
    }

    return "<table>" + response.replace(/\r|\n|\t/g,"") + "</table>"
}

module.exports = getCharacteristicsMilTools