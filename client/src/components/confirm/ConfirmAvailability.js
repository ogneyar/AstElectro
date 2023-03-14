// ConfirmAvailability
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import { CONFIRM_AVAILABILITY_ROUTE, SCROLL_TOP, SCROLL_TOP_MOBILE } from '../../utils/consts'
import scrollUp from '../../utils/scrollUp'
// import { sendMessage } from '../../http/telegramAPI'
import { createOrder } from '../../http/orderAPI'
import Loading from '../Loading'

import './ConfirmAvailability.css'


const ConfirmAvailability = (props) => {

    const history = useHistory()

    const [ loading, setLoading ] = useState(false)

    const onClickButtonConfirm = async () => {
        props?.setMessage("")
        // запустить лоадер во внешнем компоненте
        if (props?.load !== undefined) props?.setLoad(true)
        // запустить лоадер в этом компоненте
        setLoading(true)
        // достаём корзину товаров из localStorage
        let cart = localStorage.getItem("cart")
        
        let order = {cart, email: props?.email}
        if (props?.deliverySum) order = {...order, deliverySum: props?.deliverySum}
        if (props?.address) order = {...order, address: props?.address}
        if (props?.delivery) order = {...order, delivery: props?.delivery}
        if (props?.client) order = {...order, client: props?.client}
        if (props?.name) order = {...order, name: props?.name}
        if (props?.phone) order = {...order, phone: props?.phone}
        if (props?.role) order = {...order, role: props?.role}

        await createOrder(order).then(data => {
            if (data?.error) {
                // бывает ошибка в таком формате
                if (data.error?.error) props?.setMessage(data.error.error)
                // а бывает в таком
                else props?.setMessage(data.error)
            }else if (data?.errorCode) {
                // в таком виде ошибка прилетает от банка
                props?.setMessage(data?.errorMessage)
            }else if (data?.id) {

                // sendMessage("ПОДТВЕРЖДЕНИЕ ЗАКАЗА!!!") // отправка сообщения идёт на сервере

                history.push(CONFIRM_AVAILABILITY_ROUTE + "?id=" + data?.id)
                window.innerWidth > 991 ? scrollUp(SCROLL_TOP) : scrollUp(SCROLL_TOP_MOBILE)

            }else {
                props?.setMessage("Не предвиденная ошибка! Error: " + data.toString())
            }
        })        
    }

    return (
        <div className="ConfirmAvailability">

            {loading
            ?
                <Loading />
            :

                <Button 
                    variant={props?.variant || "danger"}
                    size="lg"
                    onClick={onClickButtonConfirm}
                >
                    {props?.text ? props?.text : "Подтвердить заказ"}
                </Button>

            }
            

        </div>
    )
}

export default ConfirmAvailability
