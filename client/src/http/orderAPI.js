
import { $host, $authHost } from './index'


export const createOrder = async (props) => {
    const {data} = await $host.post('api/order', props) 
    return data  
}

// получение ссылки на оплату (от банка)
export const getPaymentLink = async (props) => {
    const {data} = await $host.post('api/order/get_payment_link', props)
    return data  
}

export const getOrderForUser = async (id) => {
    const {data} = await $authHost.get('api/order/user/' + id) 
    return data  
}

export const getOrder = async (id) => {
    const {data} = await $host.get('api/order/' + id) 
    return data  
}

export const getOrderByUuid = async (uuid) => {
    const {data} = await $host.get('api/order/by_uuid/' + uuid) 
    return data  
}

export const getAllOrders = async (id) => {
    const {data} = await $authHost.get('api/order') 
    return data  
}

export const setPay = async (uuid) => {
    const {data} = await $host.put('api/order/pay/' + uuid) 
    return data  
}

export const setTaken = async (id) => {
    const {data} = await $host.put('api/order/taken/' + id) 
    return data  
}

export const editOrder = async (id, body) => {
    const {data} = await $authHost.put('api/order/' + id, body) 
    return data  
}

export const editOrderCart = async (id, body) => {
    const {data} = await $authHost.put('api/order/cart/' + id, body) 
    return data  
}
