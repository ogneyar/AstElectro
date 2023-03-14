
const path = require('path')
const fs = require('fs')

const { Product, Brand, Category } = require("../../models/models")


module.exports = async (body) => {

    if (!fs.existsSync(path.resolve(__dirname, '..', '..', 'static', 'sitemaps'))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', '..', 'static', 'sitemaps'))
        }catch(e) {
            console.log(`Создать папку 'sitemaps' не удалось.`)
        }
    }

    let { routes } = body
    let xml    
    let date = new Date().toISOString()
    let formatDate = date.substring(0, date.indexOf("T"))

// создание main.xml

// такие отступы необходимы для корректной записи в файл
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://leidtogi.ru</loc>
        <lastmod>${formatDate}</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://leidtogi.ru/shop</loc>
        <lastmod>${formatDate}</lastmod>
        <priority>1.0</priority>
    </url>`

    if (routes) {
        if (typeof(routes) === "string") {
            routes = JSON.parse(routes)
            if (typeof(routes) === "string") {
                routes = JSON.parse(routes)
            }
        }
        if (Array.isArray(routes)) {
            routes.forEach(i => {
// такие отступы необходимы для корректной записи в файл
                if (i !== "/" && i !== "/shop") xml += `
    <url>
        <loc>https://leidtogi.ru${i}</loc>
        <lastmod>${formatDate}</lastmod>
    </url>`

            })
        }
    }
    xml += `
</urlset>`

    fs.writeFileSync(path.resolve(__dirname, '..', '..', 'static', 'sitemaps', 'main.xml'), xml)


// создание products.xml

// такие отступы необходимы для корректной записи в файл
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    let products = await Product.findAll()
    const brands = await Brand.findAll()
            
    let productsFilter = products.filter(i => {
        let img                    
        try {
            img = JSON.parse(i.img)
        }catch(e) {}
        if (img && Array.isArray(img) && img[0].big !== undefined) { 
            if ( ! i.request && i.price > 0 && i.have) return true 
        }
        // если нет изображений
        // если "цена по запросу" или нет цены
        // если нет в наличии
        // тогда убираем из списка
        return false                
    })

    productsFilter.forEach((i,idx) => {
        
        let brandName = "unknown"
        brands.forEach(j => i.brandId === j.id ? brandName = j.name.toLowerCase() : null )

        xml += `
    <url>
        <loc>https://leidtogi.ru/${brandName}/${i.url}</loc>
        <lastmod>${formatDate}</lastmod>
    </url>`
        
    })
        
    xml += `
</urlset>`

    fs.writeFileSync(path.resolve(__dirname, '..', '..', 'static', 'sitemaps', 'products.xml'), xml)


// создание categories.xml

// такие отступы необходимы для корректной записи в файл
xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    const categories = await Category.findAll()

    let arrayCategories = []
    // добавляем категории первого уровня
    arrayCategories = getArrayCategories()

    arrayCategories.forEach(i => {
        i.forEach(cat => {
            let yes = reCategory(cat)
        
            if (yes) xml += `
    <url>
        <loc>https://leidtogi.ru/${cat.url}</loc>
        <lastmod>${formatDate}</lastmod>
    </url>`

        })
    })
    
    xml += `
</urlset>`

    fs.writeFileSync(path.resolve(__dirname, '..', '..', 'static', 'sitemaps', 'categories.xml'), xml)
    
    // рекурсивная функция возвращает массив массивов категорий [ [1], [2], ... ,[n] ] - 1,2,..,n уровень вложения
    function getArrayCategories(array = [], level = 0) {
        let newArray = []
        if (array[0] === undefined) array.push(categories.filter(i => i.sub_category_id === 0))
        if (array[level][0] !== undefined) array[level].forEach(cat => {
            categories.forEach(i => {
                if (i.sub_category_id === cat.id) newArray.push(i)
            })
        })        
        if (newArray[0] !== undefined) {
            level++
            array.push(newArray)
            array = getArrayCategories(array, level)
        }
        return array
    }

    // рекурсивная функция возвращает true, если категория содержит товар
    function reCategory(cat) {
        let  yes = false
        if (cat.is_product) {
            for (let prod = 0; prod < products.length; prod++) {
                if (products[prod].categoryId === cat.id) {
                    yes = true
                    break
                }
            }
        }else {
            let array = categories.filter(i => i.sub_category_id === cat.id)
            for (let i = 0; i < array.length; i++) {
                yes = reCategory(array[i])
                if (yes) break
            }
        }
        return yes
    }


// создание brands.xml

// такие отступы необходимы для корректной записи в файл
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    brands.forEach(brand => {
        let yes = false
        if (brand.name.toLowerCase() !== "aeg"
            && brand.name.toLowerCase() !== "leon"
            && brand.name.toLowerCase() !== "advanta"
            && brand.name.toLowerCase() !== "leidtogi"
        ) {
            for (let prod = 0; prod < products.length; prod++) {
                if (products[prod].brandId === brand.id) {
                    yes = true
                    break
                }
            }
        }
        if (yes) {

            xml += `
    <url>
        <loc>https://leidtogi.ru/${brand.name.toLowerCase()}</loc>
        <lastmod>${formatDate}</lastmod>
    </url>`

        }
    })
    
    xml += `
</urlset>`

    fs.writeFileSync(path.resolve(__dirname, '..', '..', 'static', 'sitemaps', 'brands.xml'), xml)

    

}
