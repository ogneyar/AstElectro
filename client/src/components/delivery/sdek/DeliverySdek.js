import React, { useEffect, useState, useContext } from 'react'
import { Form, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
// eslint-disable-next-line
import HtmlReactParser from 'html-react-parser'
// eslint-disable-next-line
import { YMaps, Map, Placemark } from 'react-yandex-maps'

import { 
    sdekCalculate, sdekDeliveryPoints, sdekLocationRegions, sdekLocationSities, sdekGetLocationSitiesJSON,
    // eslint-disable-next-line
    sdekOrder, sdekGetOrder, sdekEditOrder, sdekDeleteOrder, sdekRefusalOrder, sdekNewIntakes, sdekPrintOrders, sdekGetPrintOrders,
} from '../../../http/delivery/sdekAPI'

import { DELIVERY_EXTRA_CHARGE, DELIVERY_INDEX_FROM } from '../../../utils/consts'
// eslint-disable-next-line
import { Alert } from '../../myBootstrap'
import Loading from '../../Loading'
import { Context } from '../../..'
import './DeliverySdek.css'


const DeliverySdek = observer((props) => {
    
    const { userStore } = useContext(Context)
   
    const [allCities, setAllCities] = useState([])
    const [listCities, setListCities] = useState([])
    
    // eslint-disable-next-line
    const [ tariff, setTariff ] = useState("138") // 138 - от Двери то Склада // 136 - от Склада до Склада

    const [ info, setInfo ] = useState({
        total_sum:"", period_min:"", period_max:"", weight_calc:"", currency:"", delivery_sum:""
    })
    const [ index, setIndex ] = useState("")

    const [ name, setName ] = useState("")
    const [ listCitiesNull, setListCitiesNull ] = useState(false)
    
    const [ loading, setLoading ] = useState(false) //


    useEffect(() => {
        props?.setIconImageHref("images/delivery/sdek/sdek.png")

        sdekGetLocationSitiesJSON()
            .then(data => {
                if (data[0]?.code !== undefined) {
                    setAllCities(data)
                }
            })

        let delivery_city = localStorage.getItem('delivery_city')
        if (delivery_city) {
            setName(delivery_city)
            onClickButtonDeliveryPoints({city: delivery_city})
        }

    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if (userStore.user.address && !localStorage.getItem('delivery_city')) {
            
            let address = userStore.user.address
            let result = address.match(/\d\d\d\d\d\d/)
            if (result.index !== -1) {
                setIndex(address.substring(result.index, result.index + 6))
                // postal_code
                sdekLocationSities({postal_code:address.substring(result.index, result.index + 6)})
                    .then(data => {
                        setName(data[0]?.city)
                        localStorage.setItem('delivery_city', data[0]?.city)
                        onClickButtonDeliveryPoints({city: data[0]?.city})
                    })
            }
        }
    // eslint-disable-next-line
    },[userStore?.user?.address])

     
    useEffect(() => {
        if (!listCitiesNull) findListCities()
        else {
            setListCities([])
            setListCitiesNull(false)
        }
    // eslint-disable-next-line
    },[name])

    // поиск похожих названий городов из общего списка городов boxberry 
    const findListCities = () => {
        if (name && allCities && Array.isArray(allCities)) {
            setListCities(allCities
                .filter(j => j.city.toLowerCase().startsWith(name.toLowerCase()))
                .map((i,index) => {
                    if (index < 5 && name.toLowerCase() !== i.city.toLowerCase()) {
                        return <>
                            <p 
                                style={{position:"relative",margin:0,padding:0}}
                                onClick={() => {
                                    setName(i.city)
                                    localStorage.setItem('delivery_city', i.city)
                                    setListCitiesNull(true)
                                    onClickButtonDeliveryPoints({city:i.city})
                                }} 
                            >
                                <div style={{paddingBottom:"10px"}}>г.&nbsp;{i.city}</div>
                                {/* <br /> */}
                                <small style={{position:"absolute",left:"0px",top:"15px",color:"grey"}}>{i.region}</small>
                            </p>
                            <hr />
                        </>
                    }
                    return null
                })
                .filter(k => k !== null)
            )
        }else {
            setListCities()
        }
    }
    
    // нажатие на карте метки СКЛАДА
    const calculateAndOpenPayment = async (address) => {
        let cart
        cart = localStorage.getItem('cart')
        if (cart) {
            // if (info.total_sum !== "") {
                cart = JSON.parse(cart)
                let weight = 0
                cart.forEach( i => weight += (Number(i?.value) * Number(i?.size?.weight)) )
                if (!weight) weight = 5
                weight = weight * 1000
                weight = Math.ceil(weight)
                
                let response
                if (address) {
                    response = await sdekCalculate({
                        tariff_code: tariff,
                        from_location: { postal_code: DELIVERY_INDEX_FROM }, 
                        to_location: { address }, 
                        packages: [{ weight }] 
                    })
                }else {
                    response = {error: {message: "Нет данных об адресе склада СДЭК"} }
                }

                if (response?.error) {
                    if (response.error?.message) {
                        props?.setTextAlert(`Ошибка: ${response.error.message}`)
                    }else {
                        props?.setTextAlert(`Ошибка: ${response.error}`)
                    }
                }else if (response?.errors) {
                    props?.setTextAlert(`Ошибка: ${response.errors[0].message}`)
                }else {
                    props?.setDelivery("sdek")
                    let total_sum = Math.round( ( Number(response.total_sum) * DELIVERY_EXTRA_CHARGE ) * 100 ) / 100
                    props?.setDeliverySum(total_sum)
                    props?.setPayment(true)
                }
            // }else {
                // props?.setTextAlert(`Отсутствуют данные о стоимости доставки!`)
                // alert(`Отсутствуют данные о стоимости доставки!`)
            // }

        }else {
            // props?.setTextAlert(`Отсутствуют данные о корзине товаров!`)
            alert(`Отсутствуют данные о корзине товаров!`)
        }
    }


    // подсчёт стоимости доставки
    const onClickButtonCalculate = async (args) => {
        setLoading(true)
        let cart
        cart = localStorage.getItem('cart')
        // if (cart && index.length === 6) {
        if (cart && name) {
            cart = JSON.parse(cart)
            let weight = 0
            cart.forEach( i => weight += (Number(i?.value) * Number(i?.size?.weight)) )
            
            // если вес не известен, расчитываем доставку 5ти килограммов
            // лимит до 30 килограмм
            let weightNull = false
            if (!weight) {
                weight = 5
                weightNull = true
            }

            weight = weight * 1000
            weight = Math.ceil(weight)
            setInfo({ total_sum:"", period_min:"", period_max:"", weight_calc:"", currency:"", delivery_sum:"" })
            let response, to_location
            if (args?.address) {
                to_location = { address: args.address }
            }else if (name || index) {
                if (name) {
                    let data = await getLocationSities({ city: name })
                    if (data && data?.code !== undefined) {
                        to_location = { code: data.code }
                    }else {
                        response = {error: {message: "В таком городе не найден склада СДЭК"} }
                    }
                }else if (index) {
                    to_location = { postal_code: index }
                }
            }else {
                response = {error: { message: "Не указан город / индекс" }}
            }

            if (!response) {
                if (to_location) {
                    response = await sdekCalculate({
                        tariff_code: tariff,
                        from_location: { postal_code: DELIVERY_INDEX_FROM }, 
                        to_location, 
                        packages: [{ weight }] 
                    })
                }else {
                    response = {error: { message: "Не найден объект to_location" }}
                }
            }
            
            if (response?.error) {
                if (response.error?.message) {
                    props?.setTextAlert("1) Ошибка: " + response.error.message)
                }else {
                    props?.setTextAlert("2) Ошибка: " + response.error)
                }
            }else if (response?.errors) {
                if (response.errors[0].code === "ERR_PVZ_WITH_TARIFF_MISTAKE") {
                    if (!args?.address) {
                        let { region_code } = await getLocationSities()
                        response = await sdekDeliveryPoints({region_code})
                        if (response && Array.isArray(response) && response[0]?.location !== undefined && response[0].location?.address_full !== undefined) {
                            let address = response[0].location.address_full
                            await onClickButtonCalculate({address})
                        }else {
                            props?.setTextAlert(`Ошибка: не найден адрес для региона ${region_code} (DeliverySdek).`)
                        }
                    }
                }else {
                    props?.setTextAlert("3) Ошибка: " + response.errors[0]?.message)
                }
            }else {
                if (response.total_sum) {
                    let total_sum = Math.round( ( Number(response.total_sum) * DELIVERY_EXTRA_CHARGE ) * 100 ) / 100
                    if (weightNull) setInfo({...response, weight_calc: 0, total_sum})
                    else setInfo({...response, total_sum})
                }else {
                    props?.setTextAlert(`Нет данных о стоимости доставки!`)
                }
            }
            
        }else if (!name) {
            props?.setTextAlert(`В таком городе не найден склада СДЭК.`)
        }
        // }else if (index && index.length < 6) {
        //     props?.setTextAlert(`Введите правильный индекс!`)
        // }

        setLoading(false)
    }


    const onClickButtonDeliveryPoints = async (args) => {
        if (!args?.city && !name && (!index || index.length < 6)) {
            props?.setTextAlert(`В таком городе нет склада СДЭК`)
        }else {
            setLoading(true)
            setInfo({ total_sum:"", period_min:"", period_max:"", weight_calc:"", currency:"", delivery_sum:"" })
            let response
            if (args?.region_code) {
                response = await sdekDeliveryPoints({ region_code: args.region_code })
            }else if (args?.city || name) {
                let data = await getLocationSities({ city: args?.city || name })
                if (data && data?.code !== undefined) {
                    response = await sdekDeliveryPoints({ city_code: data.code })
                }else {
                    response = {error: {message: "В таком городе не найден склада СДЭК"} }
                }
            }else {
                response = await sdekDeliveryPoints({ postal_code: index })
            }

            if (response?.error) {
                props?.setTextAlert(`Ошибка: ${response?.error?.message}`)
            }else {
                if (response && Array.isArray(response) && response.length === 1) {
                    props?.setLatitude(response[0].location.latitude)
                    props?.setLongitude(response[0].location.longitude)

                    props?.setPlacemark([{
                        latitude: response[0].location.latitude, 
                        longitude: response[0].location.longitude, 
                        code: response[0].code, // код ПВЗ
                        address: response[0].location.address_full,
                        onClick: () => calculateAndOpenPayment(response[0].location.address_full)
                    }])
                    
                }else if (response && Array.isArray(response) && response[0]?.location !== undefined) {
                    props?.setLatitude(response[0]?.location?.latitude)
                    props?.setLongitude(response[0]?.location?.longitude)

                    props?.setPlacemark(
                        response.map(i => {
                            return {
                                latitude: i.location.latitude, 
                                longitude: i.location.longitude, 
                                code: i.code, 
                                address: i.location.address_full,
                                onClick: () => calculateAndOpenPayment(i.location.address_full)
                            }
                        })
                    )
                }else {
                    if (args?.region_code) {
                        props?.setTextAlert(`В таком городе нет склада СДЭК.`)
                    }else {
                        let { region_code } = await getLocationSities()
                        if (region_code) await onClickButtonDeliveryPoints({region_code})
                        else props?.setTextAlert(`В таком городе нет склада СДЭК!`)
                    }
                }
                
            }
            setLoading(false)
        }
    }
    
    // eslint-disable-next-line
    const onClickButtonLocationRegions = async () => {
        let response = await sdekLocationRegions({})
       if (response?.error) {
            props?.setTextAlert(`Ошибка: ${response?.error?.message}`)
        }else {
            props?.setTextAlert(`${response.map(i => i?.region).join(' ')}`)
        }
    }

    // функция возвращает объект {"code":1543, "city":"Белая Калитва", "region_code":45, "sub_region":"Белокалитвинский", ...}
    const getLocationSities = async (args) => {
        let response
        if (args?.postal_code) {
            response = await sdekLocationSities({ postal_code: args?.postal_code })
        }else if (args?.city) {
            response = await sdekLocationSities({ city: args?.city })
        }else {
            response = await sdekLocationSities({ postal_code: index })
        }
        if (response?.error) {
            return {error:`Ошибка: ${response.error?.message}`}
        }else {
            return response[0]
        }
        
    }



    return (
        <div className="DeliverySdek" id="DeliverySdek"> 

            <div className="DeliverySdekTooltip">
                Введите название Вашего районного города и нажмите "Найти склад СДЭК".
                После, найдите на карте и нажмите на значёк склада СДЭК. <img src="images/delivery/sdek/sdek.png" width="30px" alt=""/>
            </div>
    
            <div className="DeliverySdekLeftPanel">

                <div className="DeliverySdekLeftPanelBox">
                    
                    {loading 
                    ? 
                        <Loading width={150}/>
                    :
                    <>
                        <hr />
                        <label className="DeliverySdekLeftPanelBox_LabelIndex">Ваш районный город: </label>
                        {/* <hr style={{width:"100%",margin:"5px",padding:0}}/> */}
                        <hr />

                        <Form.Control 
                            value={name}
                            style={{width:"150px"}}
                            onChange={e => {
                                setName(e.target.value)
                                if (e.target.value) localStorage.setItem('delivery_city', e.target.value)
                                else localStorage.removeItem('delivery_city')
                            }}
                            className='' 
                            placeholder="Город" 
                        />
                        {name && listCities && listCities[0] !== undefined
                        ? 
                            <div className='DeliveryBoxberry_ListCities'>
                                {listCities}
                            </div>
                        : null}
                        <hr />
                        <Button
                            disabled={!name}
                            variant="outline-primary"
                            onClick={onClickButtonDeliveryPoints}
                        >
                            Найти склад СДЭК
                        </Button>
                        <hr />
                        <Button
                            disabled={!name}
                            variant="outline-primary"
                            onClick={onClickButtonCalculate}
                        >
                            Стоимость доставки
                        </Button>
                    </>}
                    
                </div>

                
                {info?.total_sum
                ?
                    <div className="DeliverySdekLeftPanel_TotalSumm">
                        <div>Стоимость с НДС:&nbsp;{info.total_sum} р.</div>
                        {info?.period_min 
                        ? 
                            <div>Срок доставки:&nbsp;
                                {info?.period_min === info?.period_max 
                                ? info?.period_min 
                                : 
                                    <>от {info?.period_min} - {info?.period_max}</>
                                } д.</div> 
                        : null}
                        {info?.weight_calc 
                        ? 
                            <div>Общий вес:&nbsp;{info.weight_calc / 1000} кг.</div> 
                        : null}
                    </div>
                :null
                }

            </div>

        </div>
    )
})

export default DeliverySdek
