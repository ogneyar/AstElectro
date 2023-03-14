import { $authHost } from '../index'


// добавление товара
export const addProduct = async (formData, number, quantity = 1) => {
    const { data } = await $authHost.post('api/parser/kvt/', formData, {
        params: { 
            add: quantity,
            number
        }
    })
    return data
}

// возвращает количество всех товаров в файле
export const getLength = async (formData) => {
    const { data } = await $authHost.post('api/parser/kvt/', formData)
    return data
}

// смена цен
export const changePrices = async (formData) => {
    const { data } = await $authHost.post('api/parser/kvt/', formData, {
        params: { 
            change: true
        }
    })
    return data
}


// получить длину каталога
export const getLengthCatalogPriceFile = async () => {
    const { data } = await $authHost.post('api/parser/kvt/parse')
    return data
}

// получить длину списка ссылок товаров каталога
export const getLengthProductPriceFile = async (numberCatalog) => {
    const { data } = await $authHost.post('api/parser/kvt/parse', null, {
        params: {
            lengthProducts: true,
            numberCatalog
        }
    })
    return data
}

// получить новый прайс
export const updatePriceFile = async (numberCatalog, numberProduct) => {
    const { data } = await $authHost.post('api/parser/kvt/parse', null, { 
        params: {
            numberCatalog,
            numberProduct,
            prices: true
        }
    })
    return data
}

// сохранить прайс
export const savePriceFile = async (json) => {
    if (json && typeof(json) === "object") json = JSON.stringify(json)
    const { data } = await $authHost.post('api/parser/kvt/save_price', { json })
    return data
}
