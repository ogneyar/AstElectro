
import {$host,$authHost} from './index'


export const setFeed = async (body) => {
    const { data } = await $authHost.post('api/tester/set_feed', body)
    return data
}

export const setSiteMap = async (body) => {
    const { data } = await $authHost.post('api/tester/set_sitemap', body)
    return data
}

export const setLocationCitiesSdek = async (params) => {
    const { data } = await $authHost.get('api/tester/set_location_cities_sdek', { params })
    return data
}

export const setPlacesDl = async () => {
    const { data } = await $authHost.get('api/tester/set_places_dl')
    return data
}

export const echo = async () => {
    const { data } = await $host.get('echo')
    return data
}

export const getLengthTor = async () => {
    const { data } = await $host.get('api/tester/get_length_tor')
    return data
}

export const editWeightTor = async (start, stop) => {
    const { data } = await $host.get('api/tester/edit_weight_tor', {
        params: {
            start,
            stop
        }
    })
    return data
}

export const separationOfVendorsTmk = async (number = 1, quantity = 10) => {
    const { data } = await $authHost.post('api/parser/tmk', {}, {
        params: {
            number,
            separation: quantity
        }
    })
    return data
}

export const getLengthTmk = async () => {
    const { data } = await $authHost.post('api/parser/tmk')
    return data
}