
function getImages(string) {
    
    let lengthString, serchString, number, lengthSerchString, stringIMG
    let images = []
    
    lengthString = string.length
    
    serchString = `<div class="slides_container">`
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    string = string.substring(number, lengthString)

    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}
    
    for (let i = 0; i < 4; i++) {
        
        serchString = `<div class="slide">`
        number = string.indexOf(serchString)
        if (number === -1) {
            if (images === []) return {error:`'Не найден '${serchString}'`,string}
            else break;
        }
        string = string.substring(number, lengthString)
        
        if (!string) {
            if (images === []) return {error:`Не сработал substring после найденого '${serchString}'`}
            else break;
        } 

        serchString = `<a href="`
        lengthSerchString = serchString.length
        number = string.indexOf(serchString)
        if (number === -1) {
            if (images === []) return {error:`'Не найден '${serchString}'`,string}
            else break;
        }
        string = string.substring(number + lengthSerchString, lengthString)

        if (!string) {
            if (images === []) return {error:`Не сработал substring после найденого '${serchString}'`}
            else break;
        } 

        serchString = `"`
        number = string.indexOf(serchString)
        if (number === -1) {
            if (images === []) return {error:`'Не найден '${serchString}'`,string}
            else break;
        }
        stringIMG = string.substring(0, number)

        if (!stringIMG) {
            if (images === []) return {error:`Не сработал substring после найденого '${serchString}'`}
            else break;
        } 

        images.push("https://www.rgk-tools.com" + stringIMG)

    }
        
    return { message: images}
}
    
module.exports = getImages