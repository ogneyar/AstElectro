// eslint-disable-next-line
import {$host,$authHost} from './index'


export const getAllProductInfos = async () => {
    const { data } = await $host.get('api/product_info')
    return data
}

