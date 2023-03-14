
const path = require('path')
const Math = require('mathjs')

const { ProductSize, Product } = require('../../models/models')

const RGK = require('../../service/parser/rgk/RGK')

// const parseCsv = require('../../service/csv/parseCsv')
const parseXlsx = require('../../service/xlsx/parseXlsx')
const saveInfoInFile = require('../../service/saveInfoInFile')



class rgkController {

    // РусГеоКом
    async rgk(req, res, next) {
        try {
            let { 
                update,   // если передан параметр update (с любым значением), значит необходимо обновить файл feed.xml
                change,   // если передан параметр change (с любым значением), значит необходимо обновить цену
                add,      // если передан параметр add (с любым значением), значит необходимо добавить в БД товар по очереди под номером number
                          //  - в этом случае параметр number обязателен
                print,    // если передан параметр print=product, значит необходимо вывести на экран информацию о товарах
                          // если передан параметр print=category, значит необходимо вывести на экран информацию о категориях
                number,   // если передан параметр number без доп. параметров, значит необходимо вывести на экран товар под номером number
                quantity, // при заданном параметре добавляется партия товара от number до quantity
                category  // при заданном параметре выводится список категорий в удобочитаемом виде
            } = req.query

            let response, rgk
            // создание экземпляра класса RGK
            rgk = new RGK()

            // обработка данных файла feed.xml
            response = await rgk.run(update)
            if (response.error !== undefined) return res.json(response) // вывод ошибки

            if (category) {
                return res.json(await rgk.printCategory())
            }

            // обновление цен
            if (change) {
                return res.json(await rgk.changePrice())
            }

            // вывод информации на экран 
            if (print && ! number) {
                if (print === "category") return res.json(await rgk.print("category")) // все категории
                if (print === "product") return res.json(await rgk.print("product")) // все товары
            }

            // добавление нового товара
            if (add) {
                if (! number && number !== 0) return res.json({error: 'Ошибка, не задан number при заданном параметре add!'})

                if (quantity) return  res.json(await rgk.addParty(Number(number), Number(quantity)))
                else 
                    response = await rgk.add(Number(number))
                
                if (! response || response.error !== undefined) 
                    res.json({error: `Не смог сохранить товар, ${number} по очереди!` + response.error ? " " + response.error : ""})

                return res.json(number)
            }

            if (number || print) {
                if (number) return res.json(await rgk.print(Number(number)))
                if (print) return res.json(await rgk.print(Number(print)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await rgk.getLengthProducts()) 

        }catch(e) {
            return res.json({error: `Ошибка метода rgk! ${e}`})
        }
    }


    // добавление габаритов РусГеоКом
    async addSizes(req, res, next) {
        let size, workbook, worksheet, response = [], xlsx
        size = path.resolve(__dirname, '..', 'static', 'temp', 'rgk', 'size.xlsx')

        xlsx = await parseXlsx(size, [ "Артикул", "гр.", "д (мм)", "ш (мм)", "в (мм)" ])

        let desired, article, weight, length, width, height, volume
        for(let number = 2; number <= 317; number++) {
            article = "rgk" + xlsx[number-2]["Артикул"]
            weight = Math.round((Number(xlsx[number-2]["гр."]) / 1000), 2)
            length = xlsx[number-2]["д (мм)"]
            width = xlsx[number-2]["ш (мм)"]
            height = xlsx[number-2]["в (мм)"]
            volume = Math.round(((Number(length) /1000) * (Number(width) /1000) * (Number(height) /1000)), 4)
            
            let product = await Product.findOne({
                where: { article }
            })
            let have = false 
            if (product && product.id !== undefined) {
                have = true
                let product_size = await ProductSize.findOne({
                    where: { productId: product.id }
                })
                if ( ! product_size ) {
                    weight = weight.toString().replace(',', '.')
                    volume = volume.toString().replace(',', '.')
                    width = width.toString().replace(',', '.')
                    height = height.toString().replace(',', '.')
                    length = length.toString().replace(',', '.')
                    ProductSize.create({
                        weight, 
                        volume,
                        width,
                        height,
                        length,
                        productId: product.id 
                    })
                }
            }

            response.push({ article, weight, length, width, height, volume, have })
        }

        return res.json(response)
    }

    
}

module.exports = new rgkController()