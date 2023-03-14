import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import { getListCities, getListCitiesByName, getListPointsByCityCode, getDeliveryCosts } from '../../../http/delivery/boxberryAPI'
import Loading from '../../Loading'
import { DELIVERY_EXTRA_CHARGE, DELIVERY_BOXBERRY_CURIER_PRICE } from '../../../utils/consts'
import './DeliveryBoxberry.css'


const DeliveryBoxberry = observer((props) => {

    const [allCities, setAllCities] = useState([])
    const [listCities, setListCities] = useState([])

    const [ loading, setLoading ] = useState(false)
    const [ info, setInfo ] = useState({
        price:"", price_base:"", price_service:"", delivery_period:"", weight:""
    })
    const [ name, setName ] = useState("")
    const [ listCitiesNull, setListCitiesNull ] = useState(false)
    
    useEffect(() => {
        props?.setIconImageHref("images/delivery/boxberry/boxberry.png")

        getListCities()
            .then(data => {
                setAllCities(data)
            })

        let delivery_city = localStorage.getItem('delivery_city')
        if (delivery_city) {
            setName(delivery_city)
            onClickButtonListPoints(delivery_city)
        }
        // eslint-disable-next-line
    },[])
    
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
        if (name && allCities) {
            setListCities(allCities
                // .filter(j => j.Name.toLowerCase().includes(name.toLowerCase()))
                .filter(j => j.Name.toLowerCase().startsWith(name.toLowerCase()))
                .map((i,index) => {
                    if (index < 5 && name.toLowerCase() !== i.Name.toLowerCase()) {
                        return <>
                            <p 
                                style={{position:"relative",margin:0,padding:0}}
                                onClick={() => {
                                    setName(i.Name)
                                    localStorage.setItem('delivery_city', i.Name)
                                    // localStorage.setItem('delivery_region', i.Region)
                                    setListCitiesNull(true)
                                    onClickButtonListPoints(i.Name)
                                }} 
                            >
                                <div style={{paddingBottom:"10px"}}>{i.Prefix}.&nbsp;{i.Name}</div>
                                {/* <br /> */}
                                <small style={{position:"absolute",left:"0px",top:"15px",color:"grey"}}>{i.Region}</small>
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
    const calculateAndOpenPayment = async (code) => { 
        let cart = localStorage.getItem('cart')
        if (cart) {
            setLoading(true)
            cart = JSON.parse(cart)
            let weight = 0
            cart.forEach( i => weight += (Number(i?.value) * Number(i?.size?.weight)) )
            if (!weight) weight = 5
            weight = weight * 1000
            weight = Math.ceil(weight)
           
            if (code) {
                let response = await getDeliveryCosts({
                    target: code, // 16126
                    weight
                })
                if (response?.error) {
                    if (response.error?.message) {
                        props?.setTextAlert("Ошибка: " + response.error.message)
                    }else {
                        props?.setTextAlert("Ошибка: " + response.error)
                    }
                }else { 
                    props?.setDelivery("boxberry")
                    props?.setDeliverySum(Math.round( ( (Number(response.price) + DELIVERY_BOXBERRY_CURIER_PRICE) * DELIVERY_EXTRA_CHARGE ) * 100 ) / 100)
                    props?.setPayment(true)
                }
            }else {
                props?.setTextAlert(`Не известен номер склада Boxberry`)
            }
                
            setLoading(false)

        }else {
            props?.setTextAlert(`Отсутствуют данные о корзине товаров!`)
        }
    }

    const onClickButtonListPoints = async (name) => {
        if (name) {
            setLoading(true)
            setListCities([])
            setInfo({ price:"", price_base:"", price_service:"", delivery_period:"", weight:"" })
            let listCities = await getListCitiesByName(name)
            if (listCities[0]?.Code) {
                let response = await getListPointsByCityCode(listCities[0]?.Code)

                if (response?.error) {
                    props?.setTextAlert(`Ошибка: ${response?.error}`)
                }else {
                    let gps = response[0].GPS.split(",")
                    props?.setLatitude(gps[0])
                    props?.setLongitude(gps[1])
                    
                    props?.setPlacemark(
                        response.map(i => {
                            return {
                                latitude: i.GPS.split(",")[0], 
                                longitude: i.GPS.split(",")[1], 
                                code: i.Code, // код ПВЗ
                                address: i.Address,
                                phone: i.Phone,
                                work: i.WorkShedule,
                                description: i.TripDescription,
                                onClick: () => calculateAndOpenPayment(i.Code)
                            }
                        })
                    )
                }
            }else {
                props?.setTextAlert(`В таком городе нет склада Boxberry`)
            }
            setLoading(false)
        }
    }

    const onClickButtonDeliveryCosts = async () => {
        await onClickButtonListPoints(name)
        let cart = localStorage.getItem('cart')
        if (cart && name) {
            setLoading(true)
            setListCities([])
            cart = JSON.parse(cart)
            let weight = 0
            cart.forEach( i => weight += (Number(i?.value) * Number(i?.size?.weight)) )

            // если вес не известен, расчитываем доставку 5ти килограммов
            // лимит до 1000 кг (1 тонна)
            let weightNull = false
            if (!weight) {
                weight = 5
                weightNull = true
            }

            weight = weight * 1000
            weight = Math.ceil(weight)
            setInfo({ price:"", price_base:"", price_service:"", delivery_period:"", weight:"" })
            
            let listCities = await getListCitiesByName(name)
            if (listCities[0]?.Code) {
                let response = await getListPointsByCityCode(listCities[0].Code)

                if (response?.error) {
                    props?.setTextAlert(`Ошибка: ${response?.error}`)
                }else {
                    response = await getDeliveryCosts({
                        target: response[0].Code, // 16126
                        weight
                    })
                    if (response?.error) {
                        if (response.error?.message) {
                            props?.setTextAlert("Ошибка: " + response.error.message)
                        }else {
                            props?.setTextAlert("Ошибка: " + response.error)
                        }
                    }else {
                        let price = Math.round( ( (Number(response.price) + DELIVERY_BOXBERRY_CURIER_PRICE) * DELIVERY_EXTRA_CHARGE ) * 100 ) / 100
                        if (weightNull) setInfo({...response, price, weight: 0})
                        else setInfo({...response, price, weight})
                    }
                }
            }else {
                props?.setTextAlert(`В таком городе нет склада Boxberry`)
            }
            setLoading(false)
        }
    }

    return (
        <div
            className="DeliveryBoxberry"
        >
            <div className="DeliveryBoxberryTooltip">
                Введите название Вашего районного города и нажмите "Найти склад Boxberry".
                После, найдите на карте и нажмите на значёк склада Boxberry. <img src="images/delivery/boxberry/boxberry.png" width="30px" alt=""/>
            </div>

            <div className="DeliveryBoxberryLeftPanel">

                <div className="DeliveryBoxberryLeftPanelBox">
                    
                    {loading 
                    ? 
                        <Loading width={150}/>
                    :
                    <>
                        <hr />
                        <label className="DeliveryBoxberryLeftPanelBox_LabelIndex">Ваш районный город: </label>
                        <hr />

                        <Form.Control 
                            value={name}
                            style={{width:"150px"}}
                            type="text"
                            onFocus={() => {
                                findListCities()
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
                            <div className='DeliveryBoxberry_ListCities'>
                                {listCities}
                            </div>
                        : null}
                        <hr />
                        <Button
                            disabled={!name}
                            variant="outline-primary"
                            onClick={() => onClickButtonListPoints(name)}
                        >
                            Найти склад Boxberry
                        </Button>
                        <hr />

                        <Button
                            disabled={!name}
                            variant="outline-primary"
                            onClick={onClickButtonDeliveryCosts}
                        >
                            Стоимость доставки
                        </Button>
                    </>}
                    
                </div>
                
                {info?.price
                ?
                    <div className="DeliveryBoxberryLeftPanel_TotalSumm">
                        <div>Стоимость доставки:&nbsp;{info.price} р.</div>
                        {info?.delivery_period 
                        ? 
                            <div>Срок доставки:&nbsp;
                                {info?.delivery_period} д.
                            </div> 
                        : null}
                        {info?.weight 
                        ? 
                            <div>Общий вес:&nbsp;{info.weight / 1000} кг.</div> 
                        : null}
                    </div>
                :null
                }

            </div>

        </div>
    )
})

export default DeliveryBoxberry