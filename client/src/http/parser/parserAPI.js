// eslint-disable-next-line
import { $host, $authHost } from '../index'


// добавление товара
export const addProduct = async (args) => {
    let { brand, formData, number, quantity, chapter } = args

    let params = { 
        add: quantity || 1,
        number,
        chapter
    }

    const { data } = await $authHost.post(`api/parser/${brand}/`, formData, { params })

    return data
}

// возвращает количество всех товаров в файле
export const getLength = async (args) => {
    let { brand, formData, chapter } = args
    
    let params = { 
        chapter
    }

    const { data } = await $authHost.post(`api/parser/${brand}/`, formData, { params })
    return data
}

// смена цен
export const changePrices = async (args) => {
    let { brand, formData, chapter } = args
    
    let params = { 
        change: true,
        chapter
    }

    const { data } = await $authHost.post(`api/parser/${brand}/`, formData, { params })
    return data
}







//
// export const parseMailRu = async (email) => {
//     const {data} = await $host.get('api/parser/parse/mail.ru', {params: {email}})
//     return data
// }

//
// export const parseYaRu = async (email) => {
//     const {data} = await $host.get('api/parser/parse/ya.ru', {params: {email}})
//     return data
// }
