function getUrlVseinstrumenti(string, article) {
    if (!string) return null
    let saveString, lengthString, serchString, lengthSerchString, number

    lengthString = string.length
    serchString = `<div class="image">`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) return null
    string = string.substring(number, lengthString)

    lengthString = string.length
    serchString = `href="`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) return null
    string = string.substring(number + lengthSerchString, lengthString)

    saveString = string

    serchString = `"`
    number = string.indexOf(serchString)
    if (number === -1) return null
    string = string.substring(0, number)

    if (string.indexOf(article) === -1) string = getUrlVseinstrumenti(saveString, article)

    return string
}

module.exports = getUrlVseinstrumenti