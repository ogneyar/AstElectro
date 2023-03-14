// eslint-disable-next-line
import { $host, $authHost } from '../index'


// узнать количество товаров в файле
export const rgkGetLength = async (update = true) => {
    const {data} = await $authHost.get('api/parser/rgk', {params: {
        update
    }})
    return data
}

// добавление нового товара
export const rgkAddNewProduct = async (number) => {
    const {data} = await $authHost.get('api/parser/rgk', {params: {
        add: true,
        number
    }})
    return data
}

// добавление всех товаров
export const rgkAddAllProducts = async (number, quantity) => {
    const {data} = await $authHost.get('api/parser/rgk', {params: {
        add: true,
        number,
        quantity
    }})
    return data
}

// изменение цены 
export const rgkChangePrice = async (update = true) => {
    const {data} = await $authHost.get('api/parser/rgk', {params: {
        change: true,
        update
    }})
    return data
}

// добавление габаритов товара (пока не используется)
export const rgkAddSizes = async () => {
    const {data} = await $authHost.get('api/parser/rgk/add_sizes')
    return data
}

