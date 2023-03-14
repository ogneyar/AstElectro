
const path = require('path')
const fs = require('fs')


module.exports = function (brand, content) {

    brand = brand.toLowerCase()
    
    if (!fs.existsSync(path.resolve(__dirname, '..', 'prices', brand))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', 'prices', brand))
        }catch(e) {
            console.log(`Создать папку ${brand} не удалось.`)
            throw `Создать папку ${brand} не удалось.`
        }
    }
    
    let fileName = `price.json`
    
    // content = content.replace(/<br \/>/g, "\r\n")
    
    if (typeof(content) === "object") content = JSON.stringify(content)

    try {
        fs.writeFileSync(path.resolve(__dirname, '..', 'prices', brand, fileName), content)
    } catch (err) {
        console.log(`Записать данные в файл не удалось.`)
        throw `Записать данные в файл не удалось.`
    }

}