// eslint-disable-next-line
import { $host, $authHost } from '../index'
// import { DELIVERY_DL_DERIVAL_CITY } from '../../utils/consts'


// Калькулятор стоимости и сроков заказа
export const calculator = async (delivery, cargo) => {
    const { data } = await $host.get('api/delivery/dl/calculator',{ params: {
        delivery, // информация о доставке
        cargo // информация о товаре
    }})
    return data
}

// Калькулятор ориентировочной стоимости и сроков заказа
export const getMicroCalc = async (arrival_city, derival_city) => {
    const { data } = await $host.get('api/delivery/dl/micro_calc',{ params: {
        arrival_city, // город прибытия
        derival_city // отправка
    }})
    return data
}

// Поиск населённых пунктов (поиск кода КЛАДР)
export const getKladr = async (q, limit = 5) => {
    const { data } = await $host.get('api/delivery/dl/kladr',{ params: {
        q, // часть названия города
        limit // количество записей
    }})
    return data // { cities: [] }
}

// Справочник терминалов (метод возвращает hash и url)
export const getUrlTerminals = async () => {
    const { data } = await $host.get('api/delivery/dl/terminals')
    return data
}

// Справочник терминалов (метод возвращает файл json)
export const getTerminalsCatalog = async (url) => {
    const { data } = await $host.get('api/delivery/dl/terminals_catalog', { params: {
        url
    }})
    return data 
}

// Поиск терминалов
export const getTerminal = async (kladr) => {
    const { data } = await $host.get('api/delivery/dl/request_terminals', { params: {
        code: kladr
    }})
    return data // { terminals: [] }
}

// Поиск даты отправки груза
export const getDate = async (delivery, cargo) => {
    const { data } = await $host.get('api/delivery/dl/request_address_dates', { params: {
        delivery: { ...delivery, deliveryType: { type: "auto" } }, // информация о доставке
        cargo // информация о товаре
    }})
    return data.data // { dates: [] }
}
