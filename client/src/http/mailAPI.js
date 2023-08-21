// eslint-disable-next-line
import { $host, $authHost, $hostL } from './index'


export const sendRequestPrice = async (props) => {
    const {data} = await $host.post('api/mail/request_price', props) 
    return data  
}

export const sendRequestProducts = async (props) => {
    const {data} = await $host.post('api/mail/request_products', props) 
    return data  
}

export const sendRequestProductsL = async (props) => {
    // props = { ...props, email_from: process.env.REACT_APP_API_EMAIL_FROM }
    // const {data} = await $hostL.post('api/mail/request_products_ast', props) 
    const {data} = await $host.post('api/mail/request_products_l', props) 
    return data  
}

export const sendCallBackL = async (props) => {
    const {data} = await $host.post('api/mail/callback_l', props) 
    return data  
}
