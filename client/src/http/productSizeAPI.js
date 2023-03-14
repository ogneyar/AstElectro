// eslint-disable-next-line
import {$host,$authHost} from './index'


export const getAllProductSizes = async () => {
    const {data} = await $host.get('api/product_size')
    return data
}

