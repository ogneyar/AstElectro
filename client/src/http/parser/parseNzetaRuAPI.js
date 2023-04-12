
import { $host } from '../index'


// получение данных о всех товарах
export const getAllProducts = async (token) => {
    let body = {
        token,
        run: true
    }
    const { data } = await $host.post('api/parser/nzeta/parse', body)
    return data
}

// получение данных о товаре по артикулу
export const getProduct = async (token, article = "") => {
    let body = {
        token,
        get_product: true,
        article
    }
    const { data } = await $host.post('api/parser/nzeta/parse', body)
    return data
}


