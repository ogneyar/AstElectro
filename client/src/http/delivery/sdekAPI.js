import { $host, $authHost } from '../index'

// подсчёт стоимости заказа
export const sdekCalculate = async (body) => {
    // ожидается объект, минимум с тремя параметрами: from_location, to_location, packages 
    // (по умолчанию tariff_code = 139 от Двери до Двери)
    const {data} = await $host.post('api/delivery/sdek/calculate',body)
    return data
}

// создание заказа
export const sdekOrder = async (id, body) => {
    // id - номер зарегистрированного пользователя
    // body - ожидается объект, минимум с четырьмя параметрами: recipient, from_location, to_location, packages 
    // (по умолчанию tariff_code = 139 от Двери до Двери)
    const {data} = await $authHost.post('api/delivery/sdek/new_order/' + id, body)
    return data
}

// получение информации о заказе
export const sdekGetOrder = async (id) => {
    // id - номер заказа в таблице deliveries
    const {data} = await $authHost.get('api/delivery/sdek/get_order/' + id)
    return data
}

// изменение информации в заказе
export const sdekEditOrder = async (id, body) => {
    // id - номер заказа в таблице deliveries
    // body - ожидается объект с данными, которые необходимо изменить
    const {data} = await $authHost.patch('api/delivery/sdek/edit_order/' + id, body)
    return data
}

// удаление заказа
export const sdekDeleteOrder = async (id) => {
    // id - номер заказа в таблице deliveries
    const {data} = await $authHost.delete('api/delivery/sdek/delete_order/' + id)
    return data
}

// отказ от заказа
export const sdekRefusalOrder = async (id) => {
    // id - номер заказа в таблице deliveries
    const {data} = await $authHost.post('api/delivery/sdek/refusal_order/' + id)
    return data
}

// регистрация заявки на вызов курьера
export const sdekNewIntakes = async (id, body) => {
    // id - номер заказа в таблице deliveries
    const {data} = await $authHost.post('api/delivery/sdek/intakes/' + id, body)
    return data
}

//
export const sdekDeliveryPoints = async (body) => {
    const {data} = await $host.get('api/delivery/sdek/delivery_points/', {params: { ...body }})
    return data
}

//
export const sdekLocationRegions = async (body) => {
    const {data} = await $host.get('api/delivery/sdek/location_regions/', {params: { ...body }})
    return data
}

//
export const sdekLocationSities = async (params) => {
    const {data} = await $host.get('api/delivery/sdek/location_cities/', { params })
    return data
}

//
export const sdekGetLocationSitiesJSON = async () => {
    const {data} = await $host.get('/deliveries/sdek/locationCities.json')
    return data
}

// Формирование квитанции к заказу
export const sdekPrintOrders = async (arrayId, body) => {
    // arrayId - массив id номеров заказа в таблице deliveries
    const {data} = await $authHost.post('api/delivery/sdek/print_orders', {...body,orders:arrayId})
    return data
}

// Получение квитанции к заказу
export const sdekGetPrintOrders = async (uuid) => {
    // uuid - идентификатор квитанции, ссылку на которую необходимо получить
    const {data} = await $authHost.get('api/delivery/sdek/print_orders/' + uuid)
    return data
}