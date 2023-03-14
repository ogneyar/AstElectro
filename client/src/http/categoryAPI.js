import {$host,$authHost} from './index'


export const createCategory = async (name, url, sub_category_id = 0) => {
    const {data} = await $authHost.post('api/category', {name, url, sub_category_id}) 
    return data  
}

export const fetchAllCategories = async () => {
    const {data} = await $host.get('api/category', {params: {
        limit: "-1" // происходила какая-то херня с мобильной версией, добавил params с левым параметром limit и всё заработало
    }})
    return data
}

export const fetchCategories = async (sub_id = 0) => {
    const {data} = await $host.get('api/category/' + sub_id)
    return data
}

export const fetchCategoriesForBrand = async (brandName) => {
    const {data} = await $host.get('api/category/brand/' + brandName)
    return data
}

export const fetchArrayCategories = async (nameCategory) => {
    const {data} = await $host.get('api/category/arrays/' + nameCategory)
    return data
}

export const deleteCategory = async (id) => {
    const {data} = await $authHost.delete('api/category/' + id)
    return data
}

export const updateCategory = async (id, body) => {
    const {data} = await $authHost.put('api/category/' + id, body)
    return data
}