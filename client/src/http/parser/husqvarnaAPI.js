// eslint-disable-next-line
import { $host, $authHost } from '../index'


// добавление товара
export const addProduct = async (formData, number) => {
    const {data} = await $authHost.post('api/parser/husqvarna/', formData, {
        params: { 
            add: true,
            number
        }
    })
    return data
}

// возвращает количество всех товаров в файле
export const getLength = async (formData) => {
    const {data} = await $authHost.post('api/parser/husqvarna/', formData)
    return data
}

// добавление всех товаров из файла
export const addAllProducts = async (formData) => {
    const {data} = await $authHost.post('api/parser/husqvarna/', formData, {
        params: { 
            add: true,
            all: true
        }
    })
    return data
}

// смена цен
export const changePrices = async (formData) => {
    const {data} = await $authHost.post('api/parser/husqvarna', formData, {
        params: { 
            change: true,
            all: true
        }
    })
    return data
}
