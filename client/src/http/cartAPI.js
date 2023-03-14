// eslint-disable-next-line
import {$host,$authHost} from './index'


export const createCart = async (userId, value) => {
    const {data} = await $host.post('api/cart/', {userId, value}) 
    return data  
}