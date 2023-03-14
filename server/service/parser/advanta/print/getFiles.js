
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const uuid = require('uuid')
let sharp = require('sharp')
const createFoldersAndDeleteOldFiles = require('../../../createFoldersAndDeleteOldFiles.js')


module.exports = async (image, article) => {

    let files = `[`

    if (image) {

        let imageName = uuid.v4()  + '.jpg'
        
        createFoldersAndDeleteOldFiles("advanta", article)

        let imageBig = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', '..', 'static', 'advanta', article, 'big', imageName))
        let imageSmall = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', '..', 'static', 'advanta', article, 'small', imageName))

        if (image.includes("https")) {
            https.get(image, (res) => {
                res.pipe(imageBig)
                res.pipe(sharp().resize(100)).pipe(imageSmall)
            })
        }else {
            http.get(image, (res) => {
                res.pipe(imageBig)
                res.pipe(sharp().resize(100)).pipe(imageSmall)
            })
        }
        
        files += `{"big":"advanta/${article}/big/${imageName}","small":"advanta/${article}/small/${imageName}"}`

    }else files += "{}"

    
    files += `]`

    return files

}