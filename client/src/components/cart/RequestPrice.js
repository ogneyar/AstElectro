
import React, { useState, useContext } from 'react'
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
import { sendRequestPrice } from '../../http/mailAPI'



const RequestPrice = (props) => { 
    
    const context = useContext(Context)

    const [ notificationVisible, setNotificationVisible ] = useState(false)

    const [ loading, setLoading ] = useState(false)
    const [ success, setSuccess ] = useState(false)

    const [ image ] = useState(API_URL + props?.product?.img[0]?.big)

    const [ url ] = useState(props?.product?.url)
    const [ nameProduct ] = useState(props?.product?.name)
    const [ article ] = useState(props?.product?.article)
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
    

    const history = useHistory()

    let className
    if (props?.className) className = props?.className


    const onClickRequestPrice = async () => {
        if ( ! name ) {
            window.alert("Необходимо ввести имя.")
        }else if ( ! phone || phone.replace(/\D/g, "").length < 10 ) {
            window.alert("Необходимо ввести номер телефона (10ть чисел).")
        }else if ( ! email || email.indexOf("@") === -1 || email.indexOf(".") === -1 ) {
            window.alert("Необходимо ввести почту вида email@mail.ru.")
        }else {
            setLoading(true)
            // let phoneNumber = "+7" + phone.replace(/\D/g, "")
            // console.log(phoneNumber)

            await sendRequestPrice({
                url: URL + brand.toLowerCase() + "/" + url,
                name,
                phone,
                email,
                nameProduct,
                article,
                brand
            })

            // setTimeout(()=>{
                setLoading(false)
                setSuccess(true)
            // },[1000])
        }
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
            }}
            time="600000" // в милисекундах
            size="lg"
            title="Запрос цены товара!"
            titleMore={success ? "Успех" : "Укажите своё имя, номер и почту."}
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
                        history.push(SHOP_ROUTE)
                        scrollUp(200)
                    }}
                >
                    Хорошо
                </Button>
            </div>
            : // когда запрос ещё не отправлялся
            <div
                className="RequestPriceNotification"
            >
                <div
                    className="RequestPriceNotification_Cart"
                >
                    <div
                        className="RequestPriceNotification_Cart_product"
                    >
                        <div>
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
                                артикул: {article}
                            </div>
                            <br />
                            <div
                                className="RequestPriceNotification_Cart_product_brand"
                            >
                                бренд: {brand}
                            </div>
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
                            <td><label>Ваша почта (email)&nbsp;<span style={{color:"red"}}>*</span></label>&nbsp;</td>
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
                        Сделать запрос!
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
