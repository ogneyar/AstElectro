// eslint-disable-next-line
import {$host,$authHost} from './index'


export const sendMessage = async (message) => {
    const {data} = await $authHost.post('api/telegram/sendMessage', {message}) 
    return data  
}
