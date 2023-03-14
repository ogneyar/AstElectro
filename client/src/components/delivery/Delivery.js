import React, { useState, useEffect } from 'react'
import HtmlReactParser from 'html-react-parser'
// eslint-disable-next-line
import { YMaps, Map, Placemark, FullscreenControl, TypeSelector, ZoomControl } from 'react-yandex-maps'

import DeliverySdek from './sdek/DeliverySdek'
import DeliveryBoxberry from './boxberry/DeliveryBoxberry'
import DeliveryDL from './dl/DeliveryDL'
import DeliveryPek from './DeliveryPek'
import DeliveryPochta from './DeliveryPochta'
import { SCROLL_TOP } from '../../utils/consts'
import scrollUp from '../../utils/scrollUp'
import { Alert } from '../myBootstrap'
import Loading from '../Loading'
import './Delivery.css'


export default function Delivery(props) {

    const [delivery, setDelivery] = useState("boxberry")

    const [ latitude, setLatitude ] = useState(55.75) // Долгота Белой Калитвы - 48.177645
    const [ longitude, setLongitude ] = useState(37.615) // Широта Белой Калитвы - 48.177645

    const [alertVisible, setAlertVisible] = useState(false)
    const [textAlert, setTextAlert] = useState("")
    
    const [ placemark, setPlacemark ] = useState([]) //

    const [ smallWidth, setSmallWidth ] = useState(window.innerWidth < 1000) //
    // eslint-disable-next-line
    const [ loading, setLoading ] = useState(true) //
    
    const [ iconImageHref, setIconImageHref ] = useState("") // иконка доставщика

    
    useEffect(() => {
        if (textAlert !== "") {
            setAlertVisible(true)
        }
    },[textAlert])
    
    const resize = () => {
        let div = document.getElementById("DeliveryComponent")
        if (div) {
            if (window.innerWidth < 768 && window.innerWidth > 730) {
                div.style.width = window.innerWidth - 280 + "px"
                setSmallWidth(true)
            }else if (window.innerWidth <= 730 && window.innerWidth > 687) {
                div.style.width = window.innerWidth - 250 + "px"
                setSmallWidth(true)
            }else if (window.innerWidth <= 687 && window.innerWidth > 630) {
                div.style.width = window.innerWidth - 200 + "px"
                setSmallWidth(true)
            }else if (window.innerWidth <= 630 && window.innerWidth > 590) {
                div.style.width = window.innerWidth - 150 + "px"
                setSmallWidth(true)
            }else if (window.innerWidth <= 590 && window.innerWidth > 420) {
                div.style.width = window.innerWidth - 100 + "px"
                setSmallWidth(true)
            }else if (window.innerWidth <= 420) {
                div.style.width = window.innerWidth - 50 + "px"
                setSmallWidth(true)
            }else {
                div.style.width = "100%"
                setSmallWidth(false)
            }
        }
    }

    useEffect(() => {
        window.addEventListener('resize', resize)
        
        if (document.readyState === 'complete' || document.readyState === 'interactive') setLoading(false)
    },[])

    
    // if (document.readyState === 'loading') return <Loading />
    if (loading) return <Loading />


    return (
        <div 
            className="DeliveryComponent"
            id="DeliveryComponent"
        >

            <header className="DeliveryHeader">
                <div>Расчёт доставки&nbsp;
                    {delivery === "sdek" && `"Службой Доставки Экспресс Курьер"`}
                    {delivery === "boxberry" && `"Boxberry"`}
                    {delivery === "dl" && `"Деловыми Линиями"`}
                    {delivery === "pek" && `"Первой Экспедиционной Компанией"`}
                    {delivery === "pochta" && `"Почтой России"`}
                </div>
            </header>

            <div
                className="DeliveryChoise"
            >
                
                <button
                    className={delivery === "boxberry" ? "DeliveryActionButton" : "DeliveryButton"}
                    disabled={delivery === "boxberry"}
                    onClick={() => {
                        setDelivery("boxberry")
                        setPlacemark([])
                        setIconImageHref("")
                    }}
                >
                    Boxberry
                </button>
                
                <button
                    className={delivery === "dl" ? "DeliveryActionButton" : "DeliveryButton"}
                    disabled={delivery === "dl"}
                    onClick={() => {
                        setDelivery("dl")
                        setPlacemark([])
                        setIconImageHref("")
                    }}
                >
                    Деловые Линии
                </button>
                
                <button
                    className={delivery === "sdek" ? "DeliveryActionButton" : "DeliveryButton"}
                    disabled={delivery === "sdek"}
                    onClick={() => {
                        setDelivery("sdek")
                        setPlacemark([])
                        setIconImageHref("")
                    }}
                >
                    СДЭК
                </button>
                
                {/* <button
                    className={delivery === "pek" ? "DeliveryActionButton" : "DeliveryButton"}
                    disabled={delivery === "pek"}
                    onClick={() => {
                        setDelivery("pek")
                        setPlacemark([])
                        setIconImageHref("")
                    }}
                >
                    ПЭК
                </button> */}
                {/* <button
                    className={delivery === "pochta"  ? "DeliveryActionButton" : "DeliveryButton"}
                    disabled={delivery === "pochta"}
                    onClick={() => {
                        setDelivery("pochta")
                        setPlacemark([])
                        setIconImageHref("")
                    }}
                >
                    Почта России
                </button> */}
                
            </div>

            <div
                className="DeliveryCalculation"
            >
                {delivery === "sdek" 
                ? 
                    <DeliverySdek 
                        {...props} 
                        setLatitude={setLatitude} 
                        setLongitude={setLongitude} 
                        setTextAlert={setTextAlert} 
                        setPlacemark={setPlacemark}
                        setLoadingDelivery={setLoading}
                        setIconImageHref={setIconImageHref}
                    />
                : null}

                {delivery === "boxberry" 
                ? 
                    <DeliveryBoxberry 
                        {...props} 
                        setLatitude={setLatitude} 
                        setLongitude={setLongitude} 
                        setTextAlert={setTextAlert} 
                        setPlacemark={setPlacemark}
                        setLoadingDelivery={setLoading}
                        setIconImageHref={setIconImageHref}
                    />
                : null}

                {delivery === "dl" 
                ? 
                    <DeliveryDL 
                        {...props} 
                        setLatitude={setLatitude} 
                        setLongitude={setLongitude} 
                        setTextAlert={setTextAlert} 
                        setPlacemark={setPlacemark}
                        setLoadingDelivery={setLoading}
                        setIconImageHref={setIconImageHref} 
                    />
                : null}

                {delivery === "pek" 
                ? 
                    <DeliveryPek 
                        {...props} 
                        setLatitude={setLatitude} 
                        setLongitude={setLongitude} 
                        setTextAlert={setTextAlert} 
                        setPlacemark={setPlacemark}
                        setLoadingDelivery={setLoading}
                        setIconImageHref={setIconImageHref}
                    />
                : null}
                
                {delivery === "pochta" 
                ? 
                    <DeliveryPochta 
                        {...props} 
                        setLatitude={setLatitude} 
                        setLongitude={setLongitude} 
                        setTextAlert={setTextAlert} 
                        setPlacemark={setPlacemark}
                        setLoadingDelivery={setLoading}
                        setIconImageHref={setIconImageHref}
                    />
                : null}
                
            </div>

            <div id="YMaps">
            <YMaps>
                <Map
                    state={{ 
                        // Широта (latitude), Долгота (longitude)
                        // center: [55.75, 37.615], // Москва
                        // center: [48.177645, 40.802384], // Белая Калитва
                        center: [latitude, longitude], 
                        type: 'yandex#map',
                        zoom: 12,
                        controls: [],
                    }} 
                    width="100%" 
                    height={smallWidth ? "600px" : "400px"} 
                >
                
                    {placemark && Array.isArray(placemark) && placemark[0]?.latitude !== undefined
                    ?
                        placemark.map(i => 
                            <Placemark 
                                key={i?.latitude + i?.longitude}
                                geometry={[i?.latitude, i?.longitude]} 
                                options={{
                                    iconLayout: 'default#image',
                                    // iconImageHref: 'images/delivery/sdek/sdek.png',
                                    iconImageHref: iconImageHref ? iconImageHref : undefined,
                                    iconImageSize: [40, 40],
                                  }}
                                onClick={async()=> {
                                    if (props?.setAddress) props?.setAddress(i?.address)
                                    setLoading(true)
                                    scrollUp(SCROLL_TOP)
                                    i?.onClick()
                                }}
                                
                            />
                        )
                    :null}
                    
                    {/* <FullscreenControl /> */}
                    <TypeSelector options={{ float: 'right' }} />
                    {/* <ZoomControl options={{ float: 'right' }} /> */}
                
                </Map>
            </YMaps>

            <Alert 
                show={alertVisible} 
                onHide={() => {
                    setAlertVisible(false)
                    setTextAlert("")
                }}
            >
                {HtmlReactParser(textAlert)}
            </Alert> 
            </div>

        </div>
    )
}
