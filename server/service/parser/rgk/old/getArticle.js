function getArticle(string) {

    let lengthString, serchString, number, lengthSerchString
    
    lengthString = string.length
    
    serchString = `<div class="articul">Артикул `
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    string = string.substring(number + lengthSerchString, lengthString)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}
        
    serchString = `</div>`
    number = string.indexOf(serchString)
    if (number === -1) return {error:`Не найден '${serchString}'`,string}
    
    string = string.substring(0, number)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}
        
    return {message:string.replace(/\r|\n|\t/g,"")}
}
    
module.exports = getArticle