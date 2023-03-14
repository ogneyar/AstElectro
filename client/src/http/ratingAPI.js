import {$host,$authHost} from './index'


export const createRating = async (userId, productId, rate) => {
    const {data} = await $authHost.post('api/rating', {userId, productId, rate}) 
    if (data) {

    }
    return data  
}

export const fetchAllRating = async (productId) => { // return Array
    const {data} = await $host.get('api/rating/' + productId)
    return data
}

export const fetchRating = async (userId, productId) => { // return Object
    const {data} = await $authHost.get('api/rating', {params: {userId, productId}})
    return data
}

export const deleteRating = async (userId, productId) => {
    const {data} = await $authHost.delete('api/rating', {userId, productId})
    return data
}

export const updateRating = async (userId, productId, rate) => {
    const {data} = await $authHost.put('api/rating', {userId, productId, rate})
    return data
}