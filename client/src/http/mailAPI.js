// eslint-disable-next-line
import { $host, $authHost } from './index'


export const sendRequestPrice = async (props) => {
    const {data} = await $host.post('api/mail/request_price', props) 
    return data  
}
