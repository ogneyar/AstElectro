function searchTagA(str) {
    let lengthStr, serchStr, num, before, after, saveStr

    saveStr = str

    lengthStr = str.length
    serchStr = `<a `
    num = str.indexOf(serchStr)

    if (num !== -1) {
        before = str.substring(0, num)
        
        str = str.substring(num, lengthStr)

        serchStr = `>`
        num = str.indexOf(serchStr)
        if (num === -1) return saveStr

        after = str.substring(num + 1, lengthStr)

        str = before + after
        str = str.replace(/<\/a>/,"")
        str = searchTagA(str)
    }

    return str
}

function getEquipmentMlkShop(string) {

    let lengthString, serchString, lengthSerchString, number

    lengthString = string.length
    serchString = `<h3><span>Комплект поставки</span></h3>`
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

    string = searchTagA(string)

    return {message:string.replace(/\r|\t|\n/g,"")}
}

module.exports = getEquipmentMlkShop