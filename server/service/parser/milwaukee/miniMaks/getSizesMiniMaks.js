
const parseHtml = require("../../../html/parseHtml")


function getSizesMiniMaks(string) {
    
    let weight, width, length, height, volume

    if (!string) throw `Не найдена строка string`

    let response = parseHtml(string, {
        entry: `<div class="specifications__content">`,
        start: `<table>`,
        end: `</table>`,
        return: true
    })

    if (response.search.indexOf("Вес") === -1) {
        response = parseHtml(response.rest, {
            start: `<table>`,
            end: `</table>`,
            return: true
        })
    }

    if (response.search.indexOf("Вес") === -1) throw `Не найдены габариты товара`

    string = response.search

    response = parseHtml(string, {
        entry: `Вес`,
        start: `<td class="specification-text">`,
        end: `</td>`
    })
    weight = Number(response.replace(",",".").trim())

    response = parseHtml(string, {
        entry: `Ширина`,
        start: `<td class="specification-text">`,
        end: `</td>`
    })
    width = Number(response.replace(",",".").trim()) * 10 // переводим в миллиметры

    response = parseHtml(string, {
        entry: `Длина`,
        start: `<td class="specification-text">`,
        end: `</td>`
    })
    length = Number(response.replace(",",".").trim()) * 10 // переводим в миллиметры
    
    response = parseHtml(string, {
        entry: `Высота`,
        start: `<td class="specification-text">`,
        end: `</td>`
    })
    height = Number(response.replace(",",".").trim()) * 10 // переводим в миллиметры

    volume = ((length*width*height)/1e9).toFixed(4)

    return { weight, width, length, height, volume }

}

module.exports = getSizesMiniMaks