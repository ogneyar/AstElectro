// const XLSX = require('xlsx')

const { Product, ProductInfo, Brand, Category } = require('../../../../models/models')

const getAllData = require('../getAllData.js')
const createProduct = require('../../../product/createProduct.js');
const translit = require('../../../translit');


async function addNewProduct(workbook, number) {
    
    // let brandName = "milwaukee"
    
    // if (!workbook) workbook = XLSX.readFile('newMILWAUKEE.xlsx')
    if (!workbook) return `Не найден workbook!`

    let first_sheet_name = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[first_sheet_name];

    let address_of_article = 'I'+number;
    let address_of_name = 'J'+number;
    let address_of_category = 'S'+number;

    let desired_article = worksheet[address_of_article];
    let desired_name = worksheet[address_of_name];
    let desired_category = worksheet[address_of_category];

    /* Get the value */
    let article = (desired_article ? desired_article.v : undefined);
    let name = (desired_name ? desired_name.v : undefined);
    let categoryUrl = (desired_category ? desired_category.v : undefined);


    if (article) {
        const oldProduct = await Product.findOne({
            where: {article}
        })
        if (oldProduct) {
            const productInfo = await ProductInfo.findOne({
                where: {productId:oldProduct.id,title:"description"}
            })
            if (productInfo && oldProduct.price) return `Товар с артикулом ${article} уже существует!`
        }
    }else {
        throw "Не найден артикул товара."
    }

    // парсинг сайта
    let response = await getAllData(article)

    if (response.error) return response.error

    let {images, sizes, price, description, characteristics, equipment} = response

    let have = 1
    let promo = ""
    let country = "Германия"

    const brand = await Brand.findOne({
        where: {name: "milwaukee"}
    })
    let brandId = brand.id

    const category = await Category.findOne({
        where: {url:categoryUrl}
    })
    let categoryId = category.id

    let files = JSON.stringify(images)

    let desc, charac, equip = null
    if (description) desc = {"title":"description","body":description}
    if (characteristics) charac = {"title":"characteristics","body":characteristics}
    if (equipment) equip = {"title":"equipment","body":equipment}

    let info = JSON.stringify([desc,charac,equip])

    let size = JSON.stringify(sizes)

    let url = translit(name) + "_" + article.toString()
    
    return await createProduct(name, url, price, have, article, promo, country, brandId, categoryId, files, info, size)

}

module.exports = addNewProduct