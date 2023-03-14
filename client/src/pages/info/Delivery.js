import React from 'react'

import { NavLink } from '../../components/myBootstrap'
import { CONTACTS_ROUTE } from '../../utils/consts'
import InfoPage from './InfoPage'
import './Delivery.css'


const DeliveryPages = () => {
    return (
        <InfoPage>
            <div className="DeliveryPages">
                <header>Информация о доставке!</header>

                <p>После формирования заказа Вы можете выбрать наиболее подходящий вариант доставки:</p>

                <label>Самовывоз</label>
                <p>Вы можете самостоятельно получить свой товар на складе компании в городе Курск. Адрес и график работы Вы можете посмотреть в разделе <NavLink to={CONTACTS_ROUTE}>«Контакты»</NavLink>.</p>

                <label>Доставка по городу</label>
                <p>Возможность и условия доставки по городу уточняйте у менеджеров компании.</p>

                <label>Междугородняя доставка</label>
                <p>Организуем отправку груза во все регионы с помощью транспортных компаний-партнеров. (СДЭК, Деловые Линии, Почта России, ПЭК, Боксберри и другие) До транспортных компаний груз доставляем бесплатно (ежедневно и при любой сумме заказа).</p>

            </div>
        </InfoPage>
    )
}

export default DeliveryPages
