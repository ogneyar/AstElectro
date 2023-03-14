const parseHtml = require("../../../html/parseHtml")


function getDescriptionMilTools(string, article) {

    let response

    try{
        response = parseHtml(string, {
            start: `<div class="detail_text">`,
            end: `</div>`
        })
    }catch(e) {
        return { error: `${e} (article: ${article})`}
        // throw `${e} (article: ${article})`
    }

    return "<div>" + response.replace(/\r|\n|\t/g,"") + "</div>"
}

module.exports = getDescriptionMilTools