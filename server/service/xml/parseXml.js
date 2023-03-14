
const fs = require('fs')
const convert = require('xml-js')


async function parseXml(file) {

    let xml, response, data = {}

    if (fs.existsSync(file)) {
        xml = fs.readFileSync(file, {encoding:'utf8', flag:'r'})
    }else {
        return { error: `Файл ${file} отсутствует или пуст!` }
    }

    xml = xml.replace(/\r|\n/g,"")
    
    
    let result = convert.xml2json(xml, {compact: true, spaces: 0})

    return JSON.parse(result)

}


module.exports = parseXml



// Example
// <?xml version="1.0" encoding="utf-8"?>
// shop
    // Разделы
        // Раздел parentId="10307"
            // Название
            // Код
            // КодРодителя
            // ОписаниеРаздела

    // offers
        // ДетальнаяЗапись
            // ID
            // Наименование
            // Кодраздела
            // Названиераздела
            // DETAIL_PAGE_URL
            // Артикул
            // Основноеизображение
            // ПодробноеОписание
            // ДополнительноеОписаниеНоменклатуры
            // Производитель
            // ПроизводительКод
            // ТорговаяМарка
            // Цена
            // Валюта
            // Вес
            // Длина
            // Высота
            // Ширина
            // ЕдиницаИзмерения
            // Доступноеколичество
            // Склады
                // Склад
                    // Название
                    // Остаток
                    // ЕдиницаХраненияОстатков
            // Дополнительныеизображения
                // Изображение
                    // URL
            // Характеристики
                // Характеристика
                    // Название
                    // Значение

