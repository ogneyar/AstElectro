
import { $host } from '../index'


// получение данных о товарах
export const getItems = async (token, artikul = "") => {
    let body = {
        method: "items",
        token,
        artikul
    }
    const { data } = await $host.post('api/parser/nzeta', body)
    return data
}

// получение данных о категориях
export const getStructure = async (token, id = "") => {
    let body = {
        method: "structure",
        token,
        id
    }
    const { data } = await $host.post('api/parser/nzeta', body)
    return data
}

