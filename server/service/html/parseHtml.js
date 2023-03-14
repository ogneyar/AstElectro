//
// args = { entry: `искомая строка` } // return true or false
//
// args = {
//      entry: `<div class="class_name">`, // entryPoint // точка входа (от куда начинать поиск)
//      start: `href="`, // startSearch //  стартовая строка
//      end: `"`, // endSearch //  финишная строка
//      inclusive: false, // inclusive or excluded start and end search string // включительно или исключая стартовую и финишную строки
//      return: false // return the rest of the string // вернуть остальную строку
// }
//
// return string or object { rest, search }
//
function parseHtml(string, args) { 

    let entryPoint = null, entryOr = null, startSearch = undefined, endSearch = undefined, inclusive = false, returnString = false

    if ( ! string ) throw `Отсутствует искомая строка! (parseHtml)`
    if ( ! args.entry && ! args.start && ! args.end ) throw `Нет необходимых параметров! (parseHtml)`
    if (args.entry !== undefined) entryPoint = args.entry // точка входа (от куда начинать поиск)
    if (args.entryOr !== undefined) entryOr = args.entryOr // дополнительная точка входа (от куда начинать поиск)
    if (args.start !== undefined) startSearch = args.start //  стартовая строка
    if (args.end !== undefined) endSearch = args.end //  финишная строка
    if (args.inclusive !== undefined) inclusive = args.inclusive // включительно или исключая стартовую и финишную строки
    if (args.return !== undefined) returnString = args.return // вернуть остальную строку

    let number, rest

    if (entryPoint) { 
        number = string.indexOf(entryPoint)
        if (number === -1) {
            if ( ! startSearch && ! endSearch) return false
            else {
                if (entryOr) {
                    number = string.indexOf(entryOr)
                    if (number === -1) throw `Не найден ни '${entryPoint}', ни '${entryOr}'! (parseHtml)`
                }else {
                    throw `Не найден '${entryPoint}'! (parseHtml)`
                }
            }
        }else {
            if ( ! startSearch && ! endSearch) return true
        }
        string = string.substring(number + entryPoint.length, string.length)
        if (!string) throw `Не сработал substring после найденого '${entryPoint}'! (parseHtml)`

        
    }

    number = string.indexOf(startSearch)
    if (number === -1) throw `Не найден '${startSearch}'! (parseHtml)`
    if (inclusive) string = string.substring(number, string.length)
    else string = string.substring(number + startSearch.length, string.length)
    if (!string) throw `Не сработал substring после найденого '${startSearch}'! (parseHtml)`
    
    number = string.indexOf(endSearch)
    if (number === -1) throw `Не найден '${endSearch}'! (parseHtml)`
    // if (returnString) rest = string
    if (inclusive) {
        if (returnString) rest = string.substring(number + endSearch.length, string.length)
        string = string.substring(0, number + endSearch.length)
    }else {
        if (returnString) rest = string.substring(number, string.length)
        string = string.substring(0, number)
    }
    if (!string) throw `Не сработал substring после найденого '${endSearch}'! (parseHtml)`

    string = string
        .replace(/\r|\n|\t/g,"")
        .replace(/(&nbsp;)/g," ")

    if (returnString) {
        rest = rest.replace(/\r|\n|\t/g,"")

        if ( ! inclusive ) rest = rest.replace(`${endSearch}`,"")

        return { rest, search: string }
    }

    return string

}

module.exports = parseHtml