const axios = require('axios')
const http = require('http')
const Math = require('mathjs')

const Husqvarna = require('../../service/parser/husqvarna/Husqvarna')
const parseHtml = require('../../service/html/parseHtml')

// const deleteProduct = require('../../service/product/deleteProduct')


class husqvarnaController {

    async husqvarna(req, res, next) {
        try {
            let { add, change, number, all } = req.query
            let feed = req.files && req.files.feed || undefined

            // if (!feed) return res.json(false) 
            
            let response

            let husqvarna = new Husqvarna()
            response = await husqvarna.run(feed) 

            if(response) {
                // добавление товара в БД
                if (add) {
                    if (number) { 
                        return res.json(await husqvarna.addProduct(number))
                    }else if (all) {
                        return res.send(await husqvarna.addAllProduct())
                    }else throw 'Ошибка, не задан number при заданном add!'
                }
                // смена цен
                if (change) {
                    if (number) {
                        return res.json(await husqvarna.changePrice(number))
                    }else if (all) {
                        return res.send(await husqvarna.changeAllPrice())
                    }else throw 'Ошибка, не задан number при заданном change!'
                }
                
                // вывод одной записи
                if (number) return res.json(await husqvarna.getOne(number))
                // вывод всех записей
                if (all) return res.json(await husqvarna.getAll())
                // вывод информации о  количестве записей
                return res.json(await husqvarna.getLength()) 
            }
        
            return res.json({ error: "Нет ответа от метода run класса Husqvarna!" })
        }catch(error) {
            return res.json({ error: error.replace("<","&lt;").replace(">","&gt;") })
            // return res.json({ error: `${e} (метод husqvarna)` })
        }
    }

    async test(req,res) {
        // https://husq.ru/search?search=9679339-02
        try {
            let { article } = req.query // 9678546-03
            // if ( ! article ) throw "Отсутствует article в запросе!"
            if ( ! article ) article = "9678968-01"
            let url = "http://husq.ru/search"
            let response
            await axios.get(url, { params: { search: article } })
                .then(res => response = res.data)
                .catch(err => response = {error:err})
            if (response.error !== undefined) return res.json(response.error)
            
            // если вернёт true, то выбросится исключение
            if (parseHtml(response, { entry: "Нет товаров, которые соответствуют критериям поиска" })) {
                // await deleteProduct("husqvarna", "hqv" + article)
                throw `Нет товара с артикулом ${article}`
            }

            let link = parseHtml(response, {
                entry: `<div class="product-preview">`,
                start: `href="`,
                end: `"`
            })

            let image = parseHtml(response, {
                entry: `<div class="product-preview">`,
                start: `<img src="`,
                end: `"`
            })

            await axios.get(link)
                .then(res => response = res.data)
                .catch(err => response = {error:err})
            if (response.error !== undefined) return res.json(response.error)

            let name = parseHtml(response, {
                start: `<h1 itemprop="name">`,
                end: `</h1>`
            })
           
            let description = parseHtml(response, {
                start: `id="tab-description">`,
                end: `</section>`
            })
            try {
                description = parseHtml(description, {
                    start: `<ul>`,
                    end: `</ul>`,
                    inclusive: true
                })
            }catch(error) { 
                try { description = parseHtml(description, { start: "<p>", end: "</p>", inclusive: true })
                }catch(error) { 
                    console.log("Error: ",error)
                    description = undefined
                }
            }

            let characteristics
            try {
                characteristics = parseHtml(response, {
                    entry: `class="text-uppercase">Характеристики`,
                    start: `<tbody>`,
                    end: `</tbody>`,
                    inclusive: true
                })
            }catch(error) { console.log("Error: ",error) }

            let filter
            let rest
            try {
                rest = parseHtml(response, {
                    entry: `>Фильтры</strong>`,
                    start: "<tbody>",
                    end: "</tbody>"
                })
            }catch(error) { console.log("Error: ",error) }

            if (rest) {
                let resp = { rest}
                filter = []
                let yes =true

                while (yes) {
                    let name, value
                    try {
                        resp = parseHtml(resp.rest, {
                            start: "<td >",
                            end: "</td>",
                            return: true
                        })
                        name = resp.search
                        resp = parseHtml(resp.rest, {
                            start: "<td >",
                            end: "</td>",
                            return: true
                        })
                        value = resp.search
                    }catch(error) {
                        yes = false
                    }
                    if (yes) {
                        filter.push({ name, value })
                    }
                }
            }
            
            let size
            try {
                size = parseHtml(response, {
                    entry: `>Габариты и вес`,
                    start: `<tbody>`,
                    end: `</tbody>`
                })
            }catch(error) { console.log("Error: ",error) }

            let weight = "", width = "", height = "", length = "", volume = ""

            if (size) {
                try { weight = parseHtml(size, { entry: "Вес", start: "<td >", end: "</td>" }) 
                }catch(error) { 
                    try { weight = parseHtml(characteristics, { entry: "Рабочая масса", start: "<td >", end: "</td>" })
                    }catch(error) { console.log("Error: ",error) }
                }
                try { width = parseHtml(size, { entry: "Ширина", start: "<td >", end: "</td>" })
                }catch(error) { console.log("Error: ",error) }
                try { height = parseHtml(size, { entry: "Высота", start: "<td >", end: "</td>" })
                }catch(error) { console.log("Error: ",error) }
                try { length = parseHtml(size, { entry: "Длина", start: "<td >", end: "</td>" })
                }catch(error) { console.log("Error: ",error) }

                if (width, height, length) volume = Math.round( ( Number(width) / 1000 ) * ( Number(height) / 1000 ) * ( Number(length) / 1000 ), 4 )

                size = { weight, width, height, length, volume }
            }else if (characteristics) {
                try { weight = parseHtml(characteristics, { entry: "Рабочая масса", start: "<td >", end: "</td>" })
                }catch(error) { console.log("Error: ",error) }
                if (weight){
                    size = { weight, width: 0, height: 0, length: 0, volume: 0 }
                }
            }

            return res.json({ image, name, article, description, characteristics, filter, size })
        }catch(error) {
            return res.json({ error })
        }
    }


}

module.exports = new husqvarnaController()