
import React, { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router'

import scrollUp from '../../utils/scrollUp'
// import { onClickButtonBuy } from '../../service/cart/CartBuyService'
import { API_URL, URL, SHOP_ROUTE } from '../../utils/consts'
import Notification from '../myBootstrap/Notification'
import { Button } from '../myBootstrap'
import { Context } from '../..'
import './RequestPrice.css'
import Loading from '../Loading'
import Phone from '../helpers/phone/Phone'
import Email from '../helpers/email/Email'
import { sendRequestPrice, sendRequestProducts, sendRequestProductsL } from '../../http/mailAPI'
import { fetchCategoryById } from '../../http/categoryAPI'



const RequestPrice = (props) => { 
    
    const context = useContext(Context)

    const [ notificationVisible, setNotificationVisible ] = useState(false)

    const [ loading, setLoading ] = useState(false)
    const [ success, setSuccess ] = useState(false)

    // const [ image ] = useState(props?.image)
    
    const [image, setImage] = useState(API_URL + "unknown.jpg")

    // useEffect(() => {
    //     console.log(props?.image)
    // },[])
    
    useEffect(() => {
        if (props.product.img === "in category") {
            fetchCategoryById(props.product.categoryId)
                .then(data => {
                    let info = data.info
                    let image = JSON.parse(info.image)
                    setImage(API_URL + image.path + image.files[0]) 
                })
        }
    },[props.product.img])

    const [ url ] = useState(props?.product.url)
    const [ nameProduct ] = useState(props?.product.name)
    const [ article ] = useState(props?.product.article)
    const [ brand ] = useState(() => {
        let response
        context.brandStore.brands.forEach(i => {
            if (i.id === props?.product?.brandId) response = i.name
        })
        return response
    })

    const [ name, setName ] = useState("")
    const [ phone, setPhone ] = useState("")
    const [ email, setEmail ] = useState("")

    const [ quantity, setQuantity ] = useState(1)
    const [ price ] = useState(props?.product.price)
    
    const [ multiplier, setMultiplier ] = useState(props.multiplier)

    useEffect(() => {
        if (props.product?.info && Array.isArray(props.product.info) && props.product.info[0] !== undefined) {
            let data = props.product.info.filter(item => item.title === "multiplier")[0].body
            // console.log(data)
            setMultiplier(data)
            setQuantity(data)
        }
    },[props.product?.info])

    const history = useHistory()

    let className
    if (props?.className) className = props?.className


    const onClickRequestPrice = async () => {
        if ( ! name ) {
            window.alert("Необходимо ввести имя.")
        }else if ( ! phone || phone.replace(/\D/g, "").length < 10 ) {
            window.alert("Необходимо ввести номер телефона (10ть чисел).")
        }else if ( (! email || email.indexOf("@") === -1 || email.indexOf(".") === -1) && props.action !== "Заказ" ) {
            window.alert("Необходимо ввести почту вида email@mail.ru.")
        }else {
            setLoading(true)

            if (props.action === "Заказ") {
                await sendRequestProductsL({
                    url: URL + brand.toLowerCase() + "/" + url,
                    name,
                    phone,
                    email,
                    nameProduct,
                    article,
                    price,
                    quantity,
                    price,
                    multiplier
                })
            }else {
                await sendRequestPrice({
                    url: URL + brand.toLowerCase() + "/" + url,
                    name,
                    phone,
                    email,
                    nameProduct,
                    article,
                    brand
                })
            }

            setLoading(false)
            setSuccess(true)
        }
    } 

    const onChangeQuantity = (value) => {
        if (/^-?[\d.]+(?:e-?\d+)?$/.test(value)) setQuantity(`${value}`)
    }

    const onClickButtonPlus = () => {
        setQuantity(Number(quantity) + Number(multiplier))
    }

    const onClickButtonMinus = () => {
        if (Number(quantity) > multiplier)
            setQuantity(Number(quantity) - Number(multiplier))
    }


    return (
        <>
        <Button
            className={"RequestPrice "+className}
            variant="outline-warning"
            onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setNotificationVisible(true)
            }}
        >
            {props.children}
        </Button>

        <Notification 
            show={notificationVisible} 
            onHide={() => {
                setSuccess(false)
                setLoading(false)
                setName("")
                setPhone("")
                setEmail("")
                setNotificationVisible(false)
                if (success) {
                    history.push(SHOP_ROUTE)
                    scrollUp(200)
                }
            }}
            time="600000" // в милисекундах
            size="lg"
            title={props.action === "Заказ" ? "Заказ товара!" : "Запрос цены товара!"}
            titleMore={success ? "Успех" : loading ? "..." : "Укажите своё имя, номер и почту."}
            // notClose={props?.notClose && success ? true : false}
        >
            {loading ? <Loading /> 
            :
            success ? // если запрос цены отправлен
            <div
                className="RequestPriceSuccess"
            >
                <label>Запрос успешно отправлен, ожидайте, с Вами свяжутся.</label>
                <br /><br />
                <Button
                    variant="outline-primary"
                    onClick={() => {
                        setSuccess(false)
                        setNotificationVisible(false)
                        // history.push(SHOP_ROUTE)
                        // scrollUp(200)
                    }}
                >
                    Хорошо
                </Button>
            </div>
            : // когда запрос ещё не отправлялся
            <div
                className="RequestPriceNotification noselect"
            >
                <div
                    className="RequestPriceNotification_Cart"
                >
                    <div
                        className="RequestPriceNotification_Cart_product"
                    >
                        <div
                            className="RequestPriceNotification_Cart_product_image"
                        >
                            <img src={image} width="200" alt="изображение товара" />
                        </div>
                        <div>
                            <div
                                className="RequestPriceNotification_Cart_product_name"
                            >
                                {nameProduct}
                            </div>
                            <br />
                            <div
                                className="RequestPriceNotification_Cart_product_article"
                            >
                                Артикул:&nbsp;{article}
                            </div>
                            <br />
                            <div
                                className="RequestPriceNotification_Cart_product_brand"
                            >
                                {props.action === "Заказ" 
                                ? 
                                <>
                                    <div
                                        className="RequestPriceNotification_Cart_product_quantity"
                                    >
                                        Количество в упаковке: {multiplier} шт.
                                        <br />
                                        <br />
                                        Количество:&nbsp;
                                        
                                        <span
                                            className="RequestPriceNotification_Cart_product_quantity_button"
                                            onClick={onClickButtonMinus}
                                        >
                                            -
                                        </span>
                                        <span
                                            className="RequestPriceNotification_Cart_product_quantity_span1"
                                        >
                                            {quantity}
                                        </span>
                                        <span
                                            className="RequestPriceNotification_Cart_product_quantity_button"
                                            onClick={onClickButtonPlus}
                                        >
                                            +
                                        </span>
                                        {/* <input 
                                            type="text" 
                                            value={quantity * multiplier}
                                            onChange={(e)=>onChangeQuantity(e.target.value)}
                                        /> */}
                                    </div>
                                    <span style={{color: "red"}}>укажите необходимое количество</span>
                                </>
                                : 
                                    "бренд: " + brand
                                }                                
                            </div>
                            <br />
                            <div
                                className="RequestPriceNotification_Cart_product_article"
                            >
                                Цена за ед.:&nbsp;{price}&nbsp;р.<br /><br />
                                Итого:&nbsp;{price * quantity}&nbsp;р.
                            </div>
                            <br />
                        </div>
                    </div>
                </div>

                <div
                    className="RequestPriceNotification_fields"
                >
                    <table>
                        <tr>
                            <td><label>Ваше имя&nbsp;<span style={{color:"red"}}>*</span></label>&nbsp;</td>
                            <td>
                                <input 
                                    type="text" 
                                    placeholder="Введите имя" 
                                    value={name} 
                                    onChange={e => {
                                        setName(e.target.value)
                                    }} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Ваш номер телефона&nbsp;<span style={{color:"red"}}>*</span></label>&nbsp;</td>
                            <td>
                                <Phone phone={phone} setPhone={setPhone} placeholder="Номер телефона" withLabel={true} />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Ваша почта (email)&nbsp;<span style={{color:"red"}}></span></label>&nbsp;</td>
                            <td>
                                <Email email={email} setEmail={setEmail} placeholder="Введите email" withLabel={true} />
                            </td>
                        </tr>
                    </table>
                </div>


                <div
                    className="RequestPriceNotification_DivButtons"
                >
                    <Button
                        variant="warning"
                        onClick={() => onClickRequestPrice() }
                    >
                        {props.action === "Заказ" ? "Офомить заказ!" : "Сделать запрос!"}
                    </Button>
                    
                    <Button
                        variant="outline-primary"
                        onClick={() => setNotificationVisible(false)}
                    >
                        Продолжить покупки
                    </Button>
                </div>
            </div>
            }
        </Notification>
        </>
    )
}

export default observer(RequestPrice)
