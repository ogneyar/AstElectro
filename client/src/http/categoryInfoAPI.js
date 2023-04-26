// categoryInfoAPI
import { $host, $authHost } from './index'


export const getCategoryInfoById = async (id) => {
    const {data} = await $host.get('api/category_info/' + id) 
    return data  
}

export const getAllCategoryInfos = async () => {
    const {data} = await $host.get('api/category_info') 
    return data  
}
