
const https = require('https')
const fs = require('fs')
const path = require('path')
const createFoldersAndDeleteOldFiles = require('../../../createFoldersAndDeleteOldFiles')
const parseHtml = require("../../../html/parseHtml")


async function getFiles(html, article) {
    
    let response
    let brand = "euroboor"
    
    response = parseHtml(html, {
        entry: `<div class="product-photo">`,
        start: `data-context='`,
        end: `'>`
    })
    
    response = JSON.parse(response)

    let arrayImages = response.carousel.productImages

    response = [] // обнулил ответ

    createFoldersAndDeleteOldFiles(brand, article)

    arrayImages.forEach((i, index) => {

        if (index < 4) {
            let urlBig, urlSmall, fileName, filePathBig, filePathSmall, fileBig, fileSmall

            urlBig = i.big
            urlSmall = i.small
            
            fileName = index+1 + '.jpg'
            
            filePathBig = brand + '/' + article + '/big/' + fileName
            filePathSmall = brand + '/' + article + '/small/' + fileName

            fileBig = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'static', brand, article, 'big', fileName));
    
            https.get(urlBig, function(resp) { // resp - response (ответ)
                resp.pipe(fileBig)
            })
    
            fileSmall = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'static', brand, article, 'small', fileName));
    
            https.get(urlSmall, function(resp) { // resp - response (ответ)
                resp.pipe(fileSmall)
            })

            response = [...response, {"big": filePathBig,"small": filePathSmall}]
        }
    })

    if ( ! response[0] || (response[0] && response[0].big === undefined)) response = [{}]

    return JSON.stringify(response)
}

module.exports = getFiles