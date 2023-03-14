// eslint-disable-next-line
import { $host, $authHost } from './index'


export const setSortProduct = async () => { 
    const { data } = await $authHost.post('api/sort_product')
    return data
}
