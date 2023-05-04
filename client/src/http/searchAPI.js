// eslint-disable-next-line
import {$host,$authHost} from './index'


export const searchValue = async ({ value, limit, page }) => { 
    const {data} = await $host.post('api/search', { value, limit, page })
    if ( ! data.count )  return { count: 0, rows: [] }
    if (data.count === undefined) return { count: 0, rows: [] }
        
    return data  
}

export const searchArticle = async (body) => { // body = { text, limit }
    const {data} = await $host.post('api/search/article', body) 
    if (data) {

    }
    return data  
}

export const searchName = async (body) => { // body = { text, limit }
    const {data} = await $host.post('api/search/name', body) 
    if (data) {

    }
    return data  
}
