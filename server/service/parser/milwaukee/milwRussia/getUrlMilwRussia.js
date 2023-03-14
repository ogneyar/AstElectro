
function getUrlMilwRussia(string, article) {
    if (!string) throw `Не найдена строка string у артикула: ${article} (getUrlMilwRussia)`
    let saveString, lengthString, serchString, lengthSerchString, number

    lengthString = string.length
    serchString = `<div class="image">`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) throw `Не найден '${serchString}' у артикула: ${article} (getUrlMilwRussia)`
    string = string.substring(number, lengthString)

    lengthString = string.length
    serchString = `href="`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) throw `Не найден '${serchString}' у артикула: ${article} (getUrlMilwRussia)`
    string = string.substring(number + lengthSerchString, lengthString)

    saveString = string

    serchString = `"`
    number = string.indexOf(serchString)
    if (number === -1) throw `Не найден '${serchString}' у артикула: ${article} (getUrlMilwRussia)`
    string = string.substring(0, number)

    // if (string.indexOf(article) === -1) string = getUrlMilwRussia(saveString, article)

    return string
}

module.exports = getUrlMilwRussia