{
    "offer id",
    "available",
    "offer name",
    "offer full_name",
    "offer type",
    "offer vendor",
    "offer url",
    "offer price",
    "offer picture",
    "offer param",
    "offer description",
    "offer instructions",
    "offer certificates",
    "offer category"
}

function parseCsv(string, search = `"offer id"`, separator = `;`) {
    let lengthString, serchString, number, number2, lengthSerchString, arrayKey
    let products = []
    let object = {}
    
    lengthString = string.length
    
    serchString = search
    number = string.indexOf(serchString)
    if (number === -1) return {error:`'Не найден '${serchString}'`,string}
    string = string.substring(number, lengthString)
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}
    lengthString = string.length
    
    serchString = `\n`
    lengthSerchString = serchString.length
    number = string.indexOf(serchString)
    if (number === -1) return {error:`Не найден '${serchString}'`,string}
    
    arrayKey = string.substring(0, number).replace(/\"/g, "").replace(/(\r)/g, "").split(separator)
    
    string = string.substring(number + lengthSerchString, lengthString).replace(/(\r)/g, "")
    
    if (!string) return {error:`Не сработал substring после найденого '${serchString}'`}
    
    let i = 0 // номер в массиве ключей
    let value, endValue
    while(string){
        lengthString = string.length
        
        if (string[0] === "\"") { // если есть кавычки
            serchString = `"`+separator // ищем закрывающие кавычки
            number = string.indexOf(serchString)

            let serchString2 = `"\n` // или ищем конец строки
            let number2 = string.indexOf(serchString2)

            if (number === -1) { // если закрывающие кавычки отсутствуют
                if (number2 === -1) return {error:`Не найден '${serchString}'`,string} // и нет конца строки то return error
                number = number2 // иначе меняем местами искомое значение
                serchString = serchString2 // и искомые строки
            }else { // если закрывающие кавычки найдены
                if (number2 !== -1) { // и найден конец строки
                    if (number > number2) { // сравниваем кто из них найден раньше в строке
                        number = number2 // и меняем местами
                        serchString = serchString2
                    }
                }
            }

            value = string.substring(1, number)
            
            object[arrayKey[i]] = value
            
            string = string.substring(number + serchString.length, lengthString)

            if (i + 1 < arrayKey.length) i++
            else {
                i = 0
                products.push(object)
                object = {}
            }
            continue
        }
        
        if (string[0] === separator) { // если нет контента, сразу следующий разделитель (separator) в строке

            object[arrayKey[i]] = null
            
            string = string.substring(1, lengthString)
            
            if (i + 1 < arrayKey.length) i++
            else {
                i = 0
                products.push(object)
                object = {}
            }
            continue
        }
        
        serchString = separator // ищем разделитель
        number = string.indexOf(serchString)
        if (number === -1) { // если не найден разделитель, значит конец файла
            serchString = `\n`
            number = string.indexOf(serchString)
            if (number === -1) return {error:`Не найден конец файла!`}
            
            value = string.substring(0, number) // удаляем перенос строки
            string = null
            
            object[arrayKey[i]] = value
            
            if (i + 1 < arrayKey.length) {
                return {error:`Ошибка, после сохранения последнего элемента в object, i+1 оказалось меньше длины массива ключей!!!`}
            }else {
                i = 0
                products.push(object)
                object = {}
            }
            continue
        }
        
        value = string.substring(0, number)

        serchString = `\n` 
        number2 = value.indexOf(serchString)
        if (number2 !== -1) { // если в найденом значении есть перенос строки
            endValue = value.replace(/(\r)/g, "").split("\n")
            
            if (endValue.length > 2) return {error:`Ошибка в строке '${value}', после split("\n") длина массива оказалась больше двух!`}
            
            object[arrayKey[i]] = endValue[0]
            
            if (i + 1 < arrayKey.length) return {error:`Ошибка, после сохранения последнего элемента в object, i+1 оказалось меньше длины массива ключей.`}
            else {
                i = 0
                products.push(object)
                object = {}
            }
            
            object[arrayKey[i]] = endValue[1]

            string = string.substring(number + 1, lengthString)
            
            if (i + 1 < arrayKey.length) i++
            else return {error:`Ошибка, после сохранения первого элемента в object, i+1 оказалось равным длине массива ключей!`}
            
            continue
        }
        
        object[arrayKey[i]] = value
        
        string = string.substring(number + 1, lengthString)
        
        if (i + 1 < arrayKey.length) i++
        else {
            i = 0
            products.push(object)
            object = {}
        }
    }
    
    return { message: products }
}

module.exports = parseCsv