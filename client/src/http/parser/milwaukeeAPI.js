// eslint-disable-next-line
import { $host, $authHost } from '../index'


// добавление новых товаров
export const mlkAddProduct = async (formData, number, party = 10) => {
    const {data} = await $authHost.post('api/parser/milwaukee', formData, {
        params: {
            number, 
            add: true,
            party // если надо добавить один товар, то передать 0
        }
    })
    return data
}

// получение всех данных о товаре
// export const mlkGetAll = async (article) => {
//     const {data} = await $authHost.get('api/parser/milwaukee/get_all', {params: {
//         article
//     }})
//     return data
// }

// узнать количество товаров в файле
export const mlkGetLength = async (formData) => {
    const {data} = await $authHost.post('api/parser/milwaukee', formData)
    return data
}

// смена цены одного товара
export const mlkChangePriceOne = async (formData, number) => {
    const {data} = await $authHost.post('api/parser/milwaukee', formData, {
        params: {
            change: true,
            number
        }
    })
    return data
}

// смена цены всех товаров
export const mlkChangePriceAll = async (formData, number) => {
    const {data} = await $authHost.post('api/parser/milwaukee', formData, {
        params: {
            change: true,
            number
        }
    })
    return data
}


// добавление новых товаров (старый роут)
// export const mlkAddNewProduct = async (formData, number, party) => {
//     const {data} = await $authHost.post('api/parser/milwaukee/add_new_product', formData, {
//         params: {
//             number, 
//             party
//         }
//     })
//     return data
// }