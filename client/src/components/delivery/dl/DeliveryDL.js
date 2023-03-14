import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'

import { calculator, getKladr, getUrlTerminals, getTerminalsCatalog, getTerminal, getDate } from '../../../http/delivery/dlAPI'
import Loading from '../../Loading'
import './DeliveryDL.css'
import getDerivalCity from '../../../service/delivery/dl/getDerivalCity'
// import getDate from '../../../service/delivery/dl/getDate'
import getCargo from '../../../service/delivery/dl/getCargo'
import getBrandName from '../../../service/delivery/dl/getBrandName'
import { DELIVERY_EXTRA_CHARGE } from '../../../utils/consts'


export const DeliveryBusinessLines = (props) => {
    
    const [listCities, setListCities] = useState([])
    
    const [ loading, setLoading ] = useState(false)
    const [ info, setInfo ] = useState({
        price:"", period_from:"", period_to:"", weight:""
    })
    const [ name, setName ] = useState("")
    
    const [kladr, setKladr] = useState("")
    const [terminals, setTerminals] = useState([])
    // eslint-disable-next-line
    const [variant, setVariant] = useState("address") // "address" || "terminal"

    useEffect(() => {
        props?.setIconImageHref("images/delivery/dl/dl.png")

        let delivery_city = localStorage.getItem('delivery_city')
        if (delivery_city) {
            setName(delivery_city)
            onClickButtonSearchTerminal(delivery_city)
        }
        // eslint-disable-next-line
    },[])

    // нажатие на карте метки СКЛАДА
    const calculateAndOpenPayment = async (code) => { 
        let cart = localStorage.getItem('cart')
        if (cart) {
            setLoading(true)
           
            if (code) {
                cart = JSON.parse(cart)
                let brand = await getBrandName(cart)
                let cargo = getCargo(cart)
                let street = getDerivalCity(brand)
                let derival = { address: { street } }
                let { dates } = await getDate( { derival }, cargo)

                let delivery = {
                    derival: { ...derival, produceDate: dates[1] || dates[0] },
                    arrival: { variant, address: { street: code } }
                }

                let response
                try {
                    response = await calculator(delivery, cargo)
                
                    if (response?.error) {
                        if (response.error?.message) {
                            props?.setTextAlert("Ошибка: " + response.error.message)
                        }else {
                            props?.setTextAlert("Ошибка: " + response.error)
                        }
                    }else {
                        props?.setDelivery("dl")
                        props?.setDeliverySum(Math.round( ( Number(response?.data?.price) * DELIVERY_EXTRA_CHARGE ) * 100 ) / 100)
                        props?.setPayment(true)
                    }
                }catch(e) {
                    props?.setTextAlert(`Ошибка! ${e}`)
                }

            }else { 
                props?.setTextAlert(`Не известен номер склада Деловых Линий`)
            }
                
            setLoading(false)

        }else {
            props?.setTextAlert(`Отсутствуют данные о корзине товаров!`)
        }
    }

    // нажатие кнопки "Стоимость доставки"
    const onClickButtonCalculate = async (name) => {
        setLoading(true)

        setInfo({price:"", period_from:"", period_to:"", weight:""})

        let cart = localStorage.getItem('cart')
        cart = JSON.parse(cart)
        let brand = await getBrandName(cart)
        let cargo = getCargo(cart)
        let street = getDerivalCity(brand)
        let derival = { address: { street } }
        let { dates } = await getDate( { derival }, cargo)

        // console.log("dates",dates)
        
        let delivery
        await getKladr(name).then(data => {

            if (data && data?.cities !== undefined && Array.isArray(data.cities) && data.cities[0]?.code !== undefined) {
                if (data.cities.length > 1) {
                    setListCities(data.cities.map(i => {
                        return <div key={i.code}>
                            <p 
                                style={{position:"relative",margin:0,padding:0}}
                                onClick={() => {
                                    setLoading(true)
                                    setName(i.searchString)
                                    localStorage.setItem('delivery_city', i.searchString)
                                    setListCities(undefined)
                                    
                                    delivery = {
                                        derival: { ...derival, produceDate: dates[1] || dates[0] },
                                        arrival: { variant, address: { street: i.code } }
                                    }
                                    
                                    calculator(delivery, cargo)
                                        .then(data => {
                                            if (data?.error) {
                                                if (data.error?.message) {
                                                    props?.setTextAlert(`Ошибка!! ${data.error.message}`)
                                                }else {
                                                    props?.setTextAlert(`Ошибка! ${data.error}`)
                                                }
                                            }else {
                                                setInfo({
                                                    price: Math.round( ( Number(data?.data?.price) * DELIVERY_EXTRA_CHARGE ) * 100 ) / 100, 
                                                    weight: cargo?.totalWeight
                                                })
                                            }
                                        })
                                        .catch(error => {
                                            props?.setTextAlert(`Ошибка ${error}`)
                                        })
                                        .finally(() => setLoading(false))

                                }} 
                            >
                                <div style={{paddingBottom:"10px"}}>{i.searchString}</div>
                                <small style={{position:"absolute",left:"0px",top:"15px",color:"grey"}}>{i.region_name}</small>
                            </p>
                            <hr />
                        </div>
                    }))
                    setLoading(false)
                }else {
                    
                    delivery = {
                        derival: { ...derival, produceDate: dates[1] || dates[0] },
                        arrival: { variant, address: { street: data.cities[0].code } }
                    }
                    
                    calculator(delivery, cargo)
                        .then(data => {
                            if (data?.error) {
                                if (data.error?.message) {
                                    props?.setTextAlert(`ОШИБКА!! ${data.error.message}`)
                                }else {
                                    props?.setTextAlert(`ОШИБКА! ${data.error}`)
                                }
                            }else {
                                setInfo({
                                    price: Math.round( ( Number(data?.data?.price) * DELIVERY_EXTRA_CHARGE ) * 100 ) / 100, 
                                    weight: cargo?.totalWeight
                                })
                            }
                        })
                        .catch(error => {
                            props?.setTextAlert(`ОШИБКА ${error}`)
                        })
                        .finally(() => setLoading(false))

                }
            }else {
                props?.setTextAlert(`Такой город в списке городов Деловых Линий не найден!`)
            }
        }).catch(() => setLoading(false))
    }
    

    useEffect(() => {
        if (kladr) {
            setLoading(true)
            getTerminal(kladr).then(data => {

                if (data && data?.terminals !== undefined && Array.isArray(data.terminals) && data.terminals[0]?.city !== undefined) {
                    getUrlTerminals().then(response => {
                        getTerminalsCatalog(response.url).then(catalog => {
                            catalog.forEach(i => {
                                
                                if (i.name === data.terminals[0]?.city) {

                                    props?.setLatitude(i?.latitude)
                                    props?.setLongitude(i?.longitude)

                                    setTerminals(i?.terminals?.terminal)
                                    // console.log(i);
                                }
                            })
                            setLoading(false)

                        }).catch(() => setLoading(false))
                    }).catch(() => setLoading(false))

                }

            }).catch(() => setLoading(false))
        }
        // eslint-disable-next-line
    },[kladr])


    const onClickButtonSearchTerminal = async (q) => {
        setLoading(true)

        setInfo({price:"", period_from:"", period_to:"", weight:""})

        await getKladr(q).then(data => {

            if (data && data?.cities !== undefined && Array.isArray(data.cities) && data.cities[0]?.code !== undefined) {
                if (data.cities.length > 1) {
                    setListCities(data.cities.map(i => {
                        return <div key={i.code}>
                            <p 
                                style={{position:"relative",margin:0,padding:0}}
                                onClick={() => {
                                    setName(i.searchString)
                                    localStorage.setItem('delivery_city', i.searchString)
                                    setListCities(undefined)
                                    setKladr(i.code)
                                }} 
                            >
                                <div style={{paddingBottom:"10px"}}>{i.searchString}</div>
                                <small style={{position:"absolute",left:"0px",top:"15px",color:"grey"}}>{i.region_name}</small>
                            </p>
                            <hr />
                        </div>
                    }))
                }else {
                    setKladr(data.cities[0].code)
                }
            }else {
                props?.setTextAlert(`Такой город в списке городов Деловых Линий не найден!`)
            }
        }).finally(() => setLoading(false))

    }

    
    useEffect(() => {
        if (terminals && Array.isArray(terminals) && terminals[0]?.name !== undefined) {
            // if (variant === "terminal") {
            //     setKladr(terminals[0].addressCode.street_code)
            // }
            props?.setPlacemark(
                terminals.map(i => {
                    let phone = null
                    if (i?.phones[0]?.number !== undefined) phone = i?.phones[0].number
                    return {
                        latitude: i.latitude, 
                        longitude: i.longitude,
                        address: i.fullAddress,
                        phone,
                        id: i?.id,
                        description: i?.calcSchedule?.arrival,
                        onClick: () => {
                            if (variant === "terminal") {
                                calculateAndOpenPayment(i.addressCode.street_code)
                            }else {
                                calculateAndOpenPayment(kladr)
                            }
                        }
                    }
                })
            )
        }
        // eslint-disable-next-line
    },[terminals])


    return (
        <div
            className="DeliveryDL"
        >
            <div className="DeliveryDL_Tooltip">
                Введите название Вашего районного города и нажмите "Найти склад Деловых Линий". На карте отобразятся ближайшие склады.
                После, найдите на карте и нажмите на значёк склада Деловых Линий ближайший к Вам. <img src="images/delivery/dl/dl.png" width="30px" alt=""/>
            </div>

            <div className="DeliveryDL_LeftPanel">

                <div className="DeliveryDL_LeftPanel_Box">
                    
                    {loading 
                    ? 
                        <Loading width={150}/>
                    :
                    <>
                        <hr />
                        <label className="DeliveryDL_LeftPanel_Box_LabelIndex">Ваш районный город: </label>
                        <hr />

                        <Form.Control 
                            value={name}
                            style={{width:"150px"}}
                            type="text"
                            onFocus={() => {
                                // findListCities()
                            }}
                            // onBlur={() => setOnBlurName(true)}
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
                            <div className='DeliveryDL_ListCities'>
                                {listCities}
                            </div>
                        : null}
                        <hr />
                        <Button
                            disabled={!name}
                            variant="outline-primary"
                            onClick={() => onClickButtonSearchTerminal(name)}
                        >
                            Найти склад Деловых Линий
                        </Button>
                        <hr />

                        <Button
                            disabled={!name}
                            variant="outline-primary"
                            onClick={() => onClickButtonCalculate(name)}
                        >
                            Стоимость доставки
                        </Button>
                    </>}
                    
                </div>
                
                {info?.price
                ?
                    <div className="DeliveryDL_LeftPanel_TotalSumm">
                        {/* <div>Расчёт доставки до:&nbsp;<strong>{name}</strong></div> */}
                        <div>Стоимость доставки:&nbsp;{info.price} р.</div>
                        {info?.period_to 
                        ? 
                            <div>Срок доставки:&nbsp;
                                {info?.period_to} д.
                            </div> 
                        : null}
                        {info?.weight 
                        ? 
                            <div>Общий вес:&nbsp;{info.weight} кг.</div> 
                        : null}
                    </div>
                :null
                }

            </div>

        </div>
    )
}

export default DeliveryBusinessLines