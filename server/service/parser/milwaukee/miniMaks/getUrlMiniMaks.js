const parseHtml = require("../../../html/parseHtml")

// 
function getUrlMiniMaks(string) {
    
    if (!string) throw `Не найдена строка string`

    return parseHtml(string, {
        entry: `image-list-item-wrapper`,
        start: `href="`,
        end: `"`,
    })

}

module.exports = getUrlMiniMaks