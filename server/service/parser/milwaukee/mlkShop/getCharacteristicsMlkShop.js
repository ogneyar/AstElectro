function getCharacteristicsMlkShop(string) {

    let lengthString, serchString, lengthSerchString, number

    lengthString = string.length
    serchString = `<h3><span>Характеристики</span></h3>`
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    string = string.substring(number, lengthString)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}
    
    lengthString = string.length
    serchString = `<tbody>`
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    
    string = string.substring(number, lengthString)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}

    serchString = `</tbody>`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    
    string = string.substring(0, number + lengthSerchString)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}

    
    return string.replace(/\r|\t|\n/g,"")
}

module.exports = getCharacteristicsMlkShop