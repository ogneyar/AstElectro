//
const fs = require('fs')


async function parseJson(file) {

    let json

    if (fs.existsSync(file)) {
        json = fs.readFileSync(file)//, {encoding:'utf8', flag:'r'})
    }else {
        return { error: `Файл ${file} отсутствует или пуст!` }
    }

    return JSON.parse(json)

}

module.exports = parseJson
