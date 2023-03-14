// PaymentOrderPage
import React, { useEffect, useState } from 'react'
import HtmlReactParser from 'html-react-parser'
// eslint-disable-next-line
import { useQueryParam, NumberParam, StringParam } from 'use-query-params'

import { getOrderByUuid } from '../../http/orderAPI'
import Loading from '../../components/Loading'
import Payment from '../../components/payment/Payment'
import { ADDRESS, MAIL, PHONE_ONE, PHONE_TWO } from '../../utils/consts'
import InfoPage from '../info/InfoPage'

import './PaymentOrderPage.css'


const PaymentOrderPage = () => {
    
    const [ uuid ] = useQueryParam('uuid', StringParam) // 59c86681-7cc2-4010-93fd-2a452f04a7f9 
    const [ anon ] = useQueryParam('anon', StringParam) // boolean 

    const [ name, setName ] = useState("")
    const [ phone, setPhone ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ cart, setCart ] = useState([])
    const [ amount, setAmount ] = useState("")
    const [ load, setLoad ] = useState(true)
    const [ delivery, setDelivery ] = useState("")
    const [ address, setAddress ] = useState("")
    // const [ client, setClient ] = useState("")
    // const [ role, setRole ] = useState("")
    const [ message, setMessage ] = useState("")

    useEffect(() => {
        if (uuid) {
            getOrderByUuid(uuid).then(data => {
                if (data?.name !== undefined) setName(data.name)
                if (data?.phone !== undefined) setPhone(data.phone)
                if (data?.email !== undefined) setEmail(data.email)
                if (data?.cart !== undefined) {
                    if (typeof(data.cart) === "string") {
                        // console.log(data.cart);
                        setCart(JSON.parse(data.cart))
                    }else setCart(data.cart)
                }
                if (data?.delivery !== undefined) setDelivery(data.delivery)
                if (data?.address !== undefined) setAddress(data.address)
                setLoad(false)
            })
        }
    }, [uuid])

    useEffect(() => {
        if (cart && Array.isArray(cart) && cart[0]) {
            let totalValue = 0
            cart.forEach(i => totalValue += Math.round((i.itemPrice * i.quantity.value)) / 100)
            setAmount(Math.round(totalValue * 100) / 100)
        }
    }, [cart])


    if (load) return <Loading />

    return (
        <InfoPage
            width={800}
        >
        <div
            className="PaymentOrderPage"
        >
            {message 
                ? 
                    <label
                        className="PaymentOrderPage_Message"
                    >
                        {message}
                    </label> 
                : null}
            <div>
                <div className="CreateOrderPagePayment">

                    {!anon &&
                    <>
                        {name && <p>Ваше имя: <strong>{name}</strong></p>}
                        {phone && <p>Ваш телефон: <strong>+{phone}</strong></p>}
                        <p>Ваш email: <strong>{email}</strong></p>
                        {delivery === "pickup"
                        ?
                        <>
                            <p>Адрес офиса из которого осуществляется самовывоз:</p>
                            <p><strong>{ADDRESS}</strong></p>
                        </>
                        :
                        <>
                            <p>Адрес склада{delivery === "sdek" ? " СДЕК" : delivery === "boxberry" ? " Boxberry" : delivery === "dl" ? " Деловых линий" : null }:</p>
                            <p><strong>{address}</strong></p>
                            <p>После оплаты с Вами свяжется наш менеджер и подскажет как отследить доставку, как вызвать курьера, когда ожидать прибытие Ваших покупок на склад.</p>
                        </>
                        }
                        <p>По всем возникающим вопросам обращайтесь по номеру:</p>
                        <p><strong>{HtmlReactParser(PHONE_ONE)}</strong> или <strong>{HtmlReactParser(PHONE_TWO)}</strong></p>

                        <p>Так же можете обращаться с любыми вопросами по email:</p>
                        <p><strong>{HtmlReactParser(MAIL)}</strong></p>
                        <br />

                    </>
                    }

                    <p><strong>Ваш заказ:</strong></p>
                    <div style={{border:"1px solid grey", padding:"15px 0 5px 0",width:"100%",textAlign:"center"}}>
                        {cart && Array.isArray(cart) && cart.map((i,index) => {
                            if (i.name.length > 20) {
                                return <div key={"zakaz" + index}>
                                    <span style={{fontSize:"0.8rem"}}>{i.itemCode}</span>
                                    <p>
                                        {i.positionId}.&nbsp;{i.name.substring(0,20)+"... - "+ i.quantity.value + "шт. x " + i.itemPrice / 100 + "р. - "}
                                        <strong>{Math.round((i.itemPrice * i.quantity.value)) / 100}&nbsp;р.</strong>
                                    </p>
                                </div>
                            }
                            return <div key={"zakaz" + index}>
                                <span style={{fontSize:"0.8rem"}}>{i.itemCode}</span>
                                <p>
                                    {i.positionId}.&nbsp;{i.name + i.quantity.value + "шт. x " + i.itemPrice / 100 + "р. - "}
                                    <strong>{Math.round((i.itemPrice * i.quantity.value)) / 100}&nbsp;р.</strong>
                                </p>
                            </div>
                        })}
                    </div>
                    <br />
                    <p>Итого к оплате: <strong>{amount}&nbsp;р.</strong></p>
                </div>
                
                <Payment 
                    // text="Оплатить картой" 
                    variant="danger" 
                    load={load} 
                    setLoad={setLoad} 
                    setMessage={setMessage}
                    uuid={uuid}
                />
            </div>

        </div>

        </InfoPage>
    )
}

export default PaymentOrderPage
