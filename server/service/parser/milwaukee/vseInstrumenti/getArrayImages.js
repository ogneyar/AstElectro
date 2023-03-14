const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const https = require('https')
const createFoldersAndDeleteOldFiles = require('../../../createFoldersAndDeleteOldFiles.js')


function getArrayImages(article, Html) {
    let response, lengthHtml, serchString, lengthSerchString, number
    let brand = "milwaukee"
    lengthHtml = Html.length
    serchString = `<div class="product-photo">`
    lengthSerchString = serchString.length
    number = Html.indexOf(serchString)
    Html = Html.substring(number, lengthHtml)
    
    lengthHtml = Html.length
    serchString = `data-context='`
    lengthSerchString = serchString.length
    number = Html.indexOf(serchString)
    Html = Html.substring(number + lengthSerchString, lengthHtml)

    serchString = `}'>`
    number = Html.indexOf(serchString) + 1
    Html = Html.substring(0, number)

    response = JSON.parse(Html)

    let arrayImages = []

    createFoldersAndDeleteOldFiles(brand, article)

    response.carousel.productImages.forEach((i, index) => {

        if (index < 4) {
            let urlBig, urlSmall, fileName, filePathBig, filePathSmall, fileBig, fileSmall

            urlBig = i.big
            urlSmall = i.small
            
            fileName = uuid.v4() + '.jpg'
            
            filePathBig = brand + '/' + article + '/big/' + fileName
            filePathSmall = brand + '/' + article + '/small/' + fileName

            fileBig = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'static', brand, article, 'big', fileName));
    
            https.get(urlBig, function(response) {
                response.pipe(fileBig)
            })
    
            fileSmall = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'static', brand, article, 'small', fileName));
    
            https.get(urlSmall, function(response) {
                response.pipe(fileSmall)
            })

            arrayImages = [...arrayImages, {"big": filePathBig,"small": filePathSmall}]
        }
    })


    return arrayImages
}

module.exports = getArrayImages