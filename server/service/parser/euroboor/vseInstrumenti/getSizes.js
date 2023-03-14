// Информация об упаковке


const parseHtml = require('../../../html/parseHtml')


async function getSizes(html) {
    
    let response, weight = 0, length = 0, width = 0, height = 0, volume = 0

    try {
        response = parseHtml(html, {
            entry: `Информация об упаковке`,
            start: `<ul`,
            end: `</ul>`,
            inclusive: false
        }).replace(/;/g, ".")
    }catch(e) { }

    // Вес, кг:
    try {
        weight = parseHtml(html, {
            entry: `Вес, кг:`,
            start: ` `,
            end: `</li>`,
            inclusive: false
        })
    }catch(e) { }
    
    // Длина, мм:
    try {
        length = parseHtml(html, {
            entry: `Длина, мм:`,
            start: ` `,
            end: `</li>`,
            inclusive: false
        })
    }catch(e) { }
    
    // Ширина, мм:
    try {
        width = parseHtml(html, {
            entry: `Ширина, мм:`,
            start: ` `,
            end: `</li>`,
            inclusive: false
        })
    }catch(e) { }
    
    // Высота, мм:
    try {
        height = parseHtml(html, {
            entry: `Высота, мм:`,
            start: ` `,
            end: `</li>`,
            inclusive: false
        })
    }catch(e) { }

    if (length && width && height) volume = (length * width * height / 1e9).toFixed(4) // 1e9 = 10 ** 9 = 1 000 000 000 

    if (weight) weight = weight.replace(/,/g, ".").trim()

    return { weight, length, width, height, volume}
}

module.exports = getSizes

