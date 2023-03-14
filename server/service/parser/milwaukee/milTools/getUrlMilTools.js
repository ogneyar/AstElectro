const parseHtml = require("../../../html/parseHtml")

function getUrlMilTools(string) {

    let response
    try{
        response = parseHtml(string, {
            // entry: `<div class="image_wrapper_block">`,
            entry: `ajax_load`,
            start: ` href="`,
            end: `"`
        })
    }catch(e) {
        return { error: e }
    }
    // return { error: response }
    return response
}

module.exports = getUrlMilTools