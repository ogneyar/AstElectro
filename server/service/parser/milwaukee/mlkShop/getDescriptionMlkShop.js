function getDescriptionMlkShop(string) {

    let saveString, lengthString, serchString, lengthSerchString, number, numberStart, numberEnd

    lengthString = string.length
    serchString = `<div itemprop="description">`
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    string = string.substring(number, lengthString)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}
    
    serchString = `</div>`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) return {error:`Не найден '${serchString}'`,string}
    
    string = string.substring(0, number)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}

    saveString = string

    lengthString = string.length
    serchString = `<ul>`
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    string = string.substring(number, lengthString)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}

    serchString = `</ul>`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    string = string.substring(0, number + lengthSerchString)

    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}

    lengthString = saveString.length
    serchString = `<strong>`
    numberStart = saveString.indexOf(serchString)
    if (numberStart !== -1) {
        serchString = `</strong>`
        lengthSerchString = serchString.length
        numberEnd = saveString.indexOf(serchString)
        if (numberEnd !== -1) {
            saveString = saveString.substring(numberStart, numberEnd + lengthSerchString)
            string = string + saveString
        }
    }

    return string.replace(/\r|\n|\t/g,"")
}

module.exports = getDescriptionMlkShop