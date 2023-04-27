
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const translit = require('../../../translit')


// функция создающая папки и сохраняющая файлы изображений товара заданной категории
const saveImageCategory = async (url, title, name) => {

    let folder = translit(title)
    let brand = 'nzeta'

    if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', '..', 'static', brand))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', '..', 'static', brand))
        }catch(e) {
            console.log(`Создать папку '${brand}' не удалось.`)
        }
    }
    if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', '..', 'static', brand, 'category'))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', '..', 'static', brand, 'category'))
        }catch(e) {
            console.log(`Создать папку 'category' не удалось.`)
        }
    }
    if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', '..', 'static', brand, 'category', folder))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', '..', 'static', brand, 'category', folder))
        }catch(e) {
            console.log(`Создать папку '${folder}' не удалось.`)
        }
    }
            
    let fileName = `${name}.jpg` // '1.jpg'
    
    let filePath = brand + '/category/' + folder + '/' //+ fileName
    
    let image = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', '..', 'static', brand, 'category', folder, fileName))
    
    let httpHost

    if (url.includes("https://")) {
        httpHost = https
    }else {
        httpHost = http
    }

    httpHost.get(url, (res) => {
        res.pipe(image)
    }).on('error', function(err) {
        console.error(err)
        // throw err
    }) 

    return filePath

}

module.exports = saveImageCategory
