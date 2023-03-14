// ConfirmAvailabilityPage
import React, { useContext, useEffect } from 'react'
import { useQueryParam, NumberParam } from 'use-query-params'

import InfoPage from '../info/InfoPage'
import { Context } from '../..'


const ConfirmAvailabilityPage = () => {

    const { cartStore } = useContext(Context)
    
    const [ id ] = useQueryParam('id', NumberParam) 

    useEffect(() => {
        localStorage.removeItem("cart")
    }, [])

    useEffect(() => {
        if (cartStore) {
            cartStore.setCart([])
        }
    }, [cartStore])

    return (
        <InfoPage>
            <div className="SuccessPage">
            
                <header>Заказ отправлен на подтверждение!</header>
                
                <p>Наш менеджер свяжется с Вами в ближайшее время.</p>
                
                {id && <p>Номер Вашего заказа {id}.</p>}

                <p>После подтверждения наличия товара на складе Вам будет предоставлена ссылка для оплаты заказа.</p>
                
                <p>Ожидайте.</p>

            </div>
        </InfoPage>
    )
}

export default ConfirmAvailabilityPage
