import { $authHost } from '../index'


// добавление товара
export const addProduct = async (formData, number, quantity = 1, number_sheet = 1) => { // number_sheet - номер вкладки
    const { data } = await $authHost.post('api/parser/leidtogi/', formData, {
        params: { 
            add: quantity,
            number,
            number_sheet
        }
    })
    return data
}

// возвращает количество всех товаров в файле
export const getLength = async (formData, number_sheet = 1) => {
    const { data } = await $authHost.post('api/parser/leidtogi/', formData, {
        params: { 
            number_sheet
        }
    })
    return data
}

// смена цен
export const changePrices = async (formData, number_sheet = 1) => {
    const { data } = await $authHost.post('api/parser/leidtogi/', formData, {
        params: { 
            change: true,
            number_sheet
        }
    })
    return data
}
