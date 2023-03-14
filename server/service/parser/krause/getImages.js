
const getHtml = require("../../html/getHtml")
const parseHtml = require("../../html/parseHtml")

// getImages
module.exports = async function getImages(article) {

    let html, url, imageUrl, response
    let images = []
    
    html = await getHtml("https://www.krause-systems.ru/poisk/?tx_kesearch_pi1[sortByDir]=asc&tx_kesearch_pi1[sword]=" + article)

    url = parseHtml(html, {
        entry: `class="result-title"`, // entryPoint // точка входа (от куда начинать поиск)
        start: `href="`, // startSearch //  стартовая строка
        end: `"`, // endSearch //  финишная строка
    })
    url = "https://www.krause-systems.ru" + url.replace(/&amp;/g, "&")

    html = await getHtml(url)
    
    // список изображений
    html = parseHtml(html, {
        start: `detailbilder`,
        end: `</div>`
    })
    
    for (let i = 0; i < 4; i++) {
        try{
            response = parseHtml(html, {
                start: `href="`,
                end: `"`,
                return: true
            })
            html = response.rest
            if (response.search) images.push("https://www.krause-systems.ru" + response.search)
        }catch(e) {
            if (images.length === 0) throw "Список изображений пуст"
            console.log(e)
            break
        }
    }

    return images
}
