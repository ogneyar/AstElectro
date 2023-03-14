import React from 'react'

import InfoPage from '../info/InfoPage'
import './CartPage.css'


const NullCart = () => {
    return (
        <InfoPage>
            <div className="CartCard">
                <header>Корзина / Оформление товара</header>

                <br />
                
                <label className="CardTitle">
                    <strong>Ваша корзина пуста.</strong>
                </label>
            </div>
        </InfoPage>
    )
}

export default NullCart

        