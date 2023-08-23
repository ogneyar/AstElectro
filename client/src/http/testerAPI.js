
import {$host,$authHost} from './index'


export const setFeed = async (body) => {
    const { data } = await $authHost.post('api/tester/set_feed', body)
    return data
}

export const setSiteMap = async (body) => {
    const { data } = await $authHost.post('api/tester/set_sitemap', body)
    return data
}

export const echo = async () => {
    const { data } = await $host.get('echo')
    return data
}

// обновление цен
export const updatePrice = async () => {
    const { data } = await $host.get('api/tester/update_prices' + '?token=' + process.env.REACT_APP_TOKEN_UPDATES)
    return data
}