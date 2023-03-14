import { 
    DELIVERY_DL_DERIVAL_CITY_MILWAUKEE,
    DELIVERY_DL_DERIVAL_CITY_RGK,
    DELIVERY_DL_DERIVAL_CITY_HUSQVARNA,
    DELIVERY_DL_DERIVAL_CITY_GEDORE,
    DELIVERY_DL_DERIVAL_CITY_KVT,
    DELIVERY_DL_DERIVAL_CITY_LEIDTOGI,
    DELIVERY_DL_DERIVAL_CITY_EVROBOOR,
    DELIVERY_DL_DERIVAL_CITY_TMK,
    DELIVERY_DL_DERIVAL_CITY_ADVANTA,
    DELIVERY_DL_DERIVAL_CITY_TOR,
    DELIVERY_DL_DERIVAL_CITY_KRAUSE,
    DELIVERY_DL_DERIVAL_CITY_KEDR,
    DELIVERY_DL_DERIVAL_CITY_BYCON,
    DELIVERY_DL_DERIVAL_CITY_GEFEST
} from "../../../utils/consts"


export default function getDerivalCity(brand) {
    let derival_city
    if (brand === "leidtogi") derival_city = DELIVERY_DL_DERIVAL_CITY_LEIDTOGI
    else if (brand === "milwaukee") derival_city = DELIVERY_DL_DERIVAL_CITY_MILWAUKEE
    else if (brand === "husqvarna") derival_city = DELIVERY_DL_DERIVAL_CITY_HUSQVARNA
    else if (brand === "gedore") derival_city = DELIVERY_DL_DERIVAL_CITY_GEDORE
    else if (brand === "evroboor") derival_city = DELIVERY_DL_DERIVAL_CITY_EVROBOOR
    else if (brand === "rgk") derival_city = DELIVERY_DL_DERIVAL_CITY_RGK
    else if (brand === "kvt") derival_city = DELIVERY_DL_DERIVAL_CITY_KVT
    else if (brand === "tmk") derival_city = DELIVERY_DL_DERIVAL_CITY_TMK
    else if (brand === "advanta") derival_city = DELIVERY_DL_DERIVAL_CITY_ADVANTA
    else if (brand === "tor") derival_city = DELIVERY_DL_DERIVAL_CITY_TOR
    else if (brand === "krause") derival_city = DELIVERY_DL_DERIVAL_CITY_KRAUSE
    else if (brand === "kedr") derival_city = DELIVERY_DL_DERIVAL_CITY_KEDR
    else if (brand === "bycon") derival_city = DELIVERY_DL_DERIVAL_CITY_BYCON
    else if (brand === "gefest") derival_city = DELIVERY_DL_DERIVAL_CITY_GEFEST
    else derival_city = "5000002804500000000000000" // - г. Москва, 2-й Лихачевский переулок, д. 7 (по умолчанию адрес Gedore)
    // else return { error: "Не найден derival_city" }

    return derival_city
}