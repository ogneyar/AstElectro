// class="owl-wrapper"


let https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
let sharp = require('sharp')
const createFoldersAndDeleteOldFiles = require('../../../createFoldersAndDeleteOldFiles')
const parseHtml = require("../../../html/parseHtml")


async function getFiles(html, article) {
    
    let response
    let brand = "euroboor"
    let arrayImages = []
    
    response = parseHtml(html, {
        entry: `class="image thumbnails-one all-carousel"`,
        start: `<a href="`,
        end: `"`,
        inclusive: false
    })

    arrayImages.push(response)


    response = [] // обнулил ответ

    createFoldersAndDeleteOldFiles(brand, article)

    arrayImages.forEach(async(i, index) => {

        let url, fileName, filePathBig, filePathSmall, fileBig, fileSmall

        url = i
        
        fileName = index+1 + '.jpg'
        
        filePathBig = brand + '/' + article + '/big/' + fileName
        filePathSmall = brand + '/' + article + '/small/' + fileName

        
        if ( ! url.includes("https")) {
            https = http
        }

        // let promise = new Promise((resolve, reject) => {
        
            https.get(url, (res) => {
                if (res.statusCode == 200) {
                    fileBig = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'static', brand, article, 'big', fileName))
                    fileSmall = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'static', brand, article, 'small', fileName))
                    res.pipe(fileBig)
                    res.pipe(sharp().resize(100)).pipe(fileSmall)

                    // resolve("success")

                }
                // else reject("error")
            }).on('error', (e) => {
                console.error(e)
                // reject("error")
            })
        // })


        response = [...response, {"big": filePathBig,"small": filePathSmall}]
        
    })

    if ( ! response[0] || (response[0] && response[0].big === undefined)) response = [{}]

    return JSON.stringify(response)
}

module.exports = getFiles
