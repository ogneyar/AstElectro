const path = require('path')
const fs = require('fs')


module.exports = function (brand, fileName, content) {

    brand = brand.toLowerCase()
    
    if (!fs.existsSync(path.resolve(__dirname, '..', 'static', 'info', brand))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', 'static', 'info', brand))
        }catch(e) {
            console.log(`Создать папку ${brand} не удалось.`)
            // throw `Создать папку ${brand} не удалось.`
            return null
        }
    }
    
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let min = now.getMinutes()
    let sec = now.getSeconds()
    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`
    if (hour < 10) hour = `0${hour}`
    if (min < 10) min = `0${min}`
    if (sec < 10) sec = `0${sec}`
    
    let nameFolder = `${year}.${month}.${day}_${hour}.${min}.${sec}`
    
    content = content.replace(/<br \/>/g, "\r\n")

    try {
        fs.writeFileSync(path.resolve(__dirname, '..', 'static', 'info', brand, nameFolder + "_" + fileName + ".json"), content)
    } catch (err) {
        console.log(`Записать данные в файл не удалось.`)
        // throw `Записать данные в файл не удалось.`
    }

}