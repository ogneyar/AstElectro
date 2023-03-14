// eslint-disable-next-line
import { $host, $authHost } from '../index'


// Список всех городов доставки
export const getListCities = async () => {
    const { data } = await $host.get('api/delivery/boxberry/listCities')
    return data
}

// Список городов доставки с выборкой по заданному названию города
export const getListCitiesByName = async (Name) => {
    const { data } = await $host.get('api/delivery/boxberry/listCities', { params: { Name } })
    return data
}

// Список всех ПВЗ
export const getListPoints = async () => {
    const { data } = await $host.get('api/delivery/boxberry/listPoints')
    return data
}

// Список ПВЗ по коду города
export const getListPointsByCityCode = async (CityCode) => {
    const { data } = await $host.get('api/delivery/boxberry/listPoints', { params: { CityCode } })
    return data
}

// Калькулятор стоимости доставки
export const getDeliveryCosts = async (args) => { // args = { target:16126,weight:5000 }
    const { data } = await $host.get('api/delivery/boxberry/deliveryCosts', { params: { ...args } })
    return data
}
