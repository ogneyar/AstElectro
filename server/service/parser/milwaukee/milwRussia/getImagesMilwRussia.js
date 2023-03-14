const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const https = require('https')
const createFoldersAndDeleteOldFiles = require('../../../createFoldersAndDeleteOldFiles.js')
const parseHtml = require('../../../html/parseHtml.js')

let sharp = require('sharp')


function getImagesMilwRussia(article, Html) {
    let img = []
    let response
    let brand = "milwaukee"
    
    let rest = Html
    for (let i = 0; i < 4; i++) {
        let entry
        if (i === 0) entry = `<div class="image-additional`
        else entry = undefined
        try{
            response = parseHtml(rest, {
                entry,
                start: `href="`,
                end: `"`,
                return: true
            })
        }catch(e) {
            if (i === 0 || img === []) {
                try{
                    response = parseHtml(Html, {
                        entry: `<div class="image`,
                        start: `href="`,
                        end: `"`
                    })
                    img.push(response)
                }catch(e) {
                    throw "Не найдено ни одного изображения. (getImages)"
                }
            }
            break
        }
        // если в ответе нет слова "milwrussia", то покидаем цикл
        if (response.search.indexOf("milwrussia") === -1) break

        img.push(response.search)

        rest = response.rest
    }

    let arrayImages = []

    createFoldersAndDeleteOldFiles(brand, article)

    img.forEach(image => {

        let fileName, filePathBig, filePathSmall, imageBig, imageSmall
        
        fileName = uuid.v4() + '.jpg'
        
        filePathBig = brand + '/' + article + '/big/' + fileName
        filePathSmall = brand + '/' + article + '/small/' + fileName

        imageBig = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'static', brand, article, 'big', fileName));
        imageSmall = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'static', brand, article, 'small', fileName));
        
        https.get(image, (res) => {
            res.pipe(imageBig)
            res.pipe(sharp().resize(100)).pipe(imageSmall)
        })
    
        arrayImages = [...arrayImages, {"big": filePathBig,"small": filePathSmall}]
        
    })

    return arrayImages // возвращаем массив объектов
    // или
    return JSON.stringify(arrayImages) // возвращаем строку
    
}


module.exports = getImagesMilwRussia