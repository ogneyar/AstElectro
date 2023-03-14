import React, { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router'

import scrollUp from '../../utils/scrollUp'
import { onClickButtonBuy } from '../../service/cart/CartBuyService'
import { CART_ROUTE, API_URL, URL } from '../../utils/consts'
import Notification from '../myBootstrap/Notification'
import { Button } from '../myBootstrap'
import addDataLayer from '../../service/dataLayer/add'
import removeDataLayer from '../../service/dataLayer/remove'
// import priceFormater from '../../utils/priceFormater'

import { Context } from '../..'
import './ButtonBuy.css'



const ButtonBuy = (props) => { 
    
    const context = useContext(Context)

    const [notificationVisible, setNotificationVisible] = useState(false)
    
    const history = useHistory()

    const [ value, setValue ] = useState(1) // количество единиц товара
    const [ quantity, setQuantity ] = useState(1) // общее количество товаров в корзине
    
    const [ image, setImage ] = useState(API_URL + "unknown.jpg") // по умолчанию пустое фото

    let className
    if (props?.className) className = props?.className

    useEffect(() => {
        let img
        if (props?.product?.img && typeof(props?.product?.img) === "string") {
            img = JSON.parse(props.product.img)
        }else {
            img = props.product?.img
        }
            
        if (img !== undefined && img[0] !== undefined && img[0]?.big !== undefined) {
            // if (img[0]?.small !== undefined) {
            //     setImage(API_URL + img[0]?.small)
            // }else {
                setImage(API_URL + img[0]?.big)
            // }
        }else {
            if (props.product.brandId === 9) {
                setImage(URL + "images/brands/tmk/TMK_logo_big.jpg")
            }else {
                // значение по умолчанию
                // setImage(API_URL + "unknown.jpg")
            }
        }
    }, [props?.product])

    const onClickValue = (e, arg) => {
        if (arg === "plus") {
            if (value < 1e6) { // 1e6 - 1 * 10^6 = 1 000 000
                let cart = onClickButtonBuy(e, props?.product)
                cart.then(data => {
                    data.forEach(i => {
                        if (i.id === props?.product?.id) {
                            setValue(i.value)
                        }
                    })
                    context.cartStore.setCart(data)
                })
                addDataLayer({
                    article: props?.product?.article,
                    name: props?.product?.name,
                    price: props?.product?.price,
                    value: 1
                })
            }
        }
        if (arg === "minus") {
            if (value > 1) {
                let cart = onClickButtonBuy(e, props?.product, "remove")
                cart.then(data => {
                    data.forEach(i => {
                        if (i.id === props?.product?.id) {
                            setValue(i.value)
                        }
                    })
                    context.cartStore.setCart(data)
                })
                removeDataLayer({
                    article: props?.product?.article,
                    name: props?.product?.name,
                    price: props?.product?.price,
                    value: 1
                })
            }
        }
        if (arg === "delete") {
            let cart = onClickButtonBuy(e, props?.product, "delete")
            cart.then(data => {
                setQuantity(data.length)
                setNotificationVisible(false)
                context.cartStore.setCart(data)
            })
            removeDataLayer({
                article: props?.product?.article,
                name: props?.product?.name,
                price: props?.product?.price,
                value
            })
        }
        if (arg === "change") {
            if (Number(e.target.value) && e.target.value !== value) {
                // если введённое значение больше чем 1 000 000
                if (Number(e.target.value) > 1e6) return // выходим
                if (e.target.value > value) {
                    addDataLayer({
                        article: props?.product?.article,
                        name: props?.product?.name,
                        price: props?.product?.price,
                        value: e.target.value - value
                    })
                }
                if (e.target.value < value) {
                    removeDataLayer({
                        article: props?.product?.article,
                        name: props?.product?.name,
                        price: props?.product?.price,
                        value: value - e.target.value
                    })
                }
                let cart = onClickButtonBuy(e, props?.product, "change")
                cart.then(data => {
                    data.forEach(i => {
                        if (i.id === props?.product?.id) {
                            setValue(i.value)
                        }
                    })
                    context.cartStore.setCart(data)
                })
            }
        }
    }


    return (
        <>
        <Button
            // это временный запрет на покупку товаров (в связи с обновлением цен)
            // disabled={props?.product?.brandId === 2} // 2 - это Husqvarna
            className={"ButtonBuy "+className}
            variant="outline-warning"
            onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setNotificationVisible(true)
                if (props?.product) {
                    addDataLayer({
                        article: props?.product?.article,
                        name: props?.product?.name,
                        price: props?.product?.price,
                        value: 1
                    })
                }
                
                let cart = onClickButtonBuy(e, props?.product)
                cart.then(data => {
                    data.forEach(i => {
                        if (i.id === props?.product?.id) {
                            setValue(i.value)
                        }
                    })
                    setQuantity(data.length)
                    context.cartStore.setCart(data)
                })
            }}
        >
            {props.children}
        </Button>

        <Notification 
            show={notificationVisible} 
            onHide={() => setNotificationVisible(false)}
            time="600000" // в милисекундах
            size="lg"
            title="Товар добавлен в корзину!"
            titleMore={"Товаров в корзине: " + quantity}
        >
            <div
                className="ButtonBuyNotification"
            >
                <div
                    className="NotificationCart"
                >
                    <div
                        className="NotificationCart_product"
                    >
                        <div>
                            <img 
                                src={image} 
                                width="200" 
                                alt="изображение товара" 
                            />
                        </div>
                        <div
                            className="NotificationCart_product_body"
                        >
                            <div
                                className="NotificationCart_product_name"
                            >
                                {props?.product?.name}
                            </div>
                            <br />
                            <div
                                className="NotificationCart_product_article"
                            >
                                артикул: {props?.product?.article}
                            </div>
                        </div>
                    </div>
                    <div
                        className="NotificationCart_price"
                    >
                        <div>
                            <label>Цена</label>
                            <br />
                            {/* {priceFormater(props?.product?.price)}&nbsp;р. */}
                            {props?.product?.price}&nbsp;р.
                        </div>
                        <div className="NotificationCart_price_value">
                            <label>Количество</label>
                            <br />
                            
                            <small onClick={(e) => onClickValue(e, "minus")} className="NotificationCart_price_value_minus">-</small>

                            {/* <small className="NotificationCart_price_value_data">{value}</small> */}
                            <input 
                                // className="NotificationCart_price_value_data" 
                                style={{display: "inline-block"}}
                                type="text" 
                                value={value} 
                                onChange={(e) => onClickValue(e, "change")}
                                size="2"
                            />

                            <small onClick={(e) => onClickValue(e, "plus")} className="NotificationCart_price_value_plus">+</small>
                        </div>
                        <div>
                            <label>Итого</label>
                            <br />
                            {/* {priceFormater(props?.product?.price * value)}&nbsp;р. */}
                            {Math.round((props?.product?.price * value) * 100) / 100}&nbsp;р.  
                        </div>
                        <div>
                            <label>&nbsp;</label>
                            <span onClick={(e) => onClickValue(e, "delete")} className="NotificationCart_price_delete"><i className="fa fa-window-close" aria-hidden="true"></i></span>
                        </div>
                    </div>
                </div>

                <div
                    className="NotificationDivButtons"
                >
                    <Button
                        // variant="outline-warning"
                        variant="warning"
                        onClick={() => {
                            history.push(CART_ROUTE)
                            scrollUp(200)
                        }}
                    >
                        Перейти в корзину!
                    </Button>
                    
                    <Button
                        variant="outline-primary"
                        onClick={() => setNotificationVisible(false)}
                    >
                        Продолжить покупки
                    </Button>
                </div>
            </div>
        </Notification>
        </>
    )
}

export default observer(ButtonBuy)
