const axios = require('axios')
const parseHtml = require('../../html/parseHtml.js')
// VseInstrumenti
// const getUrlVseinstrumenti = require('./vseInstrumenti/getUrlVseinstrumenti.js')
// const getArrayImages = require('./vseInstrumenti/getArrayImages.js')
// const getSizes = require('./vseInstrumenti/getSizes.js')
// MiniMaks
const getUrlMiniMaks = require('./miniMaks/getUrlMiniMaks.js')
const getSizesMiniMaks = require('./miniMaks/getSizesMiniMaks.js')
// MlkShop
const getUrlMlkShop = require('./mlkShop/getUrlMlkShop.js')
const getPriceMlkShop = require('./mlkShop/getPriceMlkShop.js')
const getDescriptionMlkShop = require('./mlkShop/getDescriptionMlkShop.js')
const getCharacteristicsMlkShop = require('./mlkShop/getCharacteristicsMlkShop.js')
const getEquipmentMlkShop = require('./mlkShop/getEquipmentMlkShop.js')
const getWeightMlkShop = require('./mlkShop/getWeightMlkShop.js')
// MilwRussia
const getUrlMilwRussia = require('./milwRussia/getUrlMilwRussia.js')
const getImagesMilwRussia = require('./milwRussia/getImagesMilwRussia.js')
// MilTools
const getUrlMilTools = require('./milTools/getUrlMilTools')
const getDescriptionMilTools = require('./milTools/getDescriptionMilTools.js')
const getCharacteristicsMilTools = require('./milTools/getCharacteristicsMilTools.js')
const getWeightMilTools = require('./milTools/getWeightMilTools.js')


async function getAllData(article, price) {

    let Html, images, sizes, description, characteristics, equipment
    let urlMlkShop, urlMilTools, string

    // получение изображений с сайта rostov.vseinstrumenti.ru
    // await axios.get('https://rostov.vseinstrumenti.ru/search_main.php', { params: { what: article } })
    //    .then(res => Html = res.data)
    // Html = "https://rostov.vseinstrumenti.ru" + getUrlVseinstrumenti(Html, article)
    // await axios.get(Html)
    //    .then(res => Html = res.data)
    // images = getArrayImages(article, Html)
    // if (!images[0]) return {error:'Нет фотографий товара',string:images}
    

    // получение габаритов с сайта www.minimaks.ru
    await axios.get('https://www.minimaks.ru/catalog', { params: { q: article } })
        .then(res => Html = res.data)
    try {
        Html = "https://www.minimaks.ru" + getUrlMiniMaks(Html) 
        await axios.get(Html).then(res => Html = res.data)
        sizes = getSizesMiniMaks(Html)
    }catch(e) {
        sizes = null
    }

    // https://mlk-shop.ru/search?search=4933451439
    await axios.get('https://mlk-shop.ru/search', {params: {
        search: article
    }}).then(res => Html = res.data)

    if (!Html) return {error:'Не сработал axios.get(https://mlk-shop.ru/search)'}

    if ( ! price ) {
        price = getPriceMlkShop(Html,article)
        if (price.error) return price
        else price = price.message
    }

    string = getUrlMlkShop(Html)

    if (string.error === undefined) {

        urlMlkShop = string.message

        // https://mlk-shop.ru/akkumulyatornaya-uglovaya-shlifovalnaya-mashina-ushm-bolgarka-milwaukee-m18-fuel-cag125x-0x?search=4933451439
        await axios.get(urlMlkShop).then(res => string = res.data)

        if (!string) return {error:`Не сработал axios.get(${urlMlkShop})`}

        description = getDescriptionMlkShop(string)
        if (description.error) description = ""

        characteristics = getCharacteristicsMlkShop(string)
        if (characteristics.error && sizes === null) return characteristics
        else {
            if (sizes === null) sizes = getWeightMlkShop(characteristics, article)
            else characteristics = ""
        }

        equipment = getEquipmentMlkShop(string)
        if (equipment.error) equipment = ""
        else equipment = equipment.message
    
    }else { // if getUrlMlkShop error

        // https://mil-tools.ru/catalog/?q=4933478986&s=Найти
        await axios.get('https://mil-tools.ru/catalog/', {params: {
            q: article,
            s: "Найти"
        }}).then(res => Html = res.data)
        
        if (!Html) return {error:'Не сработал axios.get(https://mil-tools.ru/catalog/)'}
        
        string = getUrlMilTools(Html)
        if (string.error !== undefined) return string

        urlMilTools = "https://mil-tools.ru" + string
        // https://mil-tools.ru/catalog/malaya-mekhanizatsiya/akkumulyatornye-ustanovki-almaznogo-bureniya/ustanovka_almaznogo_sverleniya_milwaukee_mxf_dcd150_0c/
        await axios.get(urlMilTools).then(res => string = res.data)

        if (!string) return {error:`Не сработал axios.get(${urlMilTools})`}

        description = getDescriptionMilTools(string, article)
        if (description.error !== undefined) description = ""

        characteristics = getCharacteristicsMilTools(string, article)
        if (characteristics.error && sizes === null) return characteristics
        else {
            if (sizes === null) sizes = getWeightMilTools(characteristics, article)
            else characteristics = ""
        }

    }
    
    // получение изображений с сайта milwrussia.ru
    await axios.get('https://milwrussia.ru/search', { params: { search: article } })
        .then(res => Html = res.data)
    Html = getUrlMilwRussia(Html, article)
    await axios.get(Html).then(res => Html = res.data)
    images = getImagesMilwRussia(article, Html)


    return {images, sizes, price, description, characteristics, equipment}
}


module.exports = getAllData