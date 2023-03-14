import axios from 'axios'


export const fetchPochta = async (from, to, weight, pack, date, time, service) => {

    // eslint-disable-next-line
    let urlTariff = "https://delivery.pochta.ru/v2/calculate/tariff" // расчёт тарифа
    // eslint-disable-next-line
    let urlDelivery = "https://delivery.pochta.ru/v2/calculate/delivery" // расчёт срока доставки
    let url = "https://delivery.pochta.ru/v2/calculate/tariff/delivery" // расчёт тарифа и срока доставки

    let json = true
    
    let dogovor = ""

    let object
    // object = 27030 // посылка стандарт
    // if (!pack) {
    //     object = 4030 // посылка не стандарт
    // }

    object = 23030 // посылка для организаций онлайн обыкновенная

    if (weight > 20000) object = 7030 // посылка EMS
    
    pack = 0
    
    let params = { json, object, from, to, weight, date, time, errorcode:0 }

    if (service) params = {...params,service}
    if (dogovor !== "") params = {...params,dogovor}
    if (pack) params = {...params,pack}
    if (object === 4030) params = {...params,closed:1}
    // if (weight > 20000) params = {...params,group:1}


    let { data } = await axios.get(url, {params})

    if (data?.errors) return { errors: data.errors }

    // console.log("data",data);

    return {
        name: data?.name,
        transName: data?.transname,
        adName: data?.postoffice[1]?.name,
        payNds: data?.paynds/100, 
        deliveryMin: data?.delivery?.min,
        deliveryMax: data?.delivery?.max
    }

}
