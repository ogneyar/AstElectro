function getUrlMlkShop(string) {

    let lengthString, serchString, lengthSerchString, number

    lengthString = string.length
    serchString = `<div class="image">`
    number = string.indexOf(serchString)
    if (number === -1) return {error:'Не найден `<div class="image">` (getUrlMlkShop)'}
    string = string.substring(number, lengthString)

    lengthString = string.length
    serchString = `href="`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) return {error:'Не найден `href="` (getUrlMlkShop)'}
    string = string.substring(number + lengthSerchString, lengthString)

    serchString = `">`
    number = string.indexOf(serchString)
    if (number === -1) return {error:'Не найден `">` (getUrlMlkShop)'}
    string = string.substring(0, number).trim() // найдена ссылка

    if (!string) return {error:'Не сработал substring после найденого `">` (getUrlMlkShop)'}

    return {message:string}
}

module.exports = getUrlMlkShop