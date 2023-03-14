function getSizes(Html) {
    let response, lengthHtml, serchString, lengthSerchString, number, weight, length, width, height
    
    lengthHtml = Html.length
    serchString = `Информация об упаковке`
    lengthSerchString = serchString.length
    number = Html.indexOf(serchString)
    Html = Html.substring(number + lengthSerchString, lengthHtml)

    lengthHtml = Html.length
    serchString = `</ul>`
    lengthSerchString = serchString.length
    number = Html.indexOf(serchString)
    Html = Html.substring(0, number + lengthSerchString)

    lengthHtml = Html.length

    serchString = `Вес, кг:`
    lengthSerchString = serchString.length
    number = Html.indexOf(serchString)
    weight = Html.substring(number + lengthSerchString, lengthHtml)
    serchString = `</li>`
    number = weight.indexOf(serchString)
    weight = weight.substring(0, number).trim()

    serchString = `Длина, мм:`
    lengthSerchString = serchString.length
    number = Html.indexOf(serchString)
    length = Html.substring(number + lengthSerchString, lengthHtml)
    serchString = `</li>`
    number = length.indexOf(serchString)
    length = length.substring(0, number).trim()

    serchString = `Ширина, мм:`
    lengthSerchString = serchString.length
    number = Html.indexOf(serchString)
    width = Html.substring(number + lengthSerchString, lengthHtml)
    serchString = `</li>`
    number = width.indexOf(serchString)
    width = width.substring(0, number).trim()

    serchString = `Высота, мм:`
    lengthSerchString = serchString.length
    number = Html.indexOf(serchString)
    height = Html.substring(number + lengthSerchString, lengthHtml)
    serchString = `</li>`
    number = height.indexOf(serchString)
    height = height.substring(0, number).trim()
    

    response = {
        "weight": weight,
        "volume": ((length*width*height)/1e9).toFixed(4),
        "length": length,
        "width": width,
        "height": height
        }

    
    return response
}

module.exports = getSizes