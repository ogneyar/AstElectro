
import React from 'react'
import { useHistory } from 'react-router-dom'

import { Container } from '../../myBootstrap'
import { 
    SHOP_ROUTE, DELIVERY_ROUTE, PAYMENT_ROUTE, DEALER_ROUTE,
    // eslint-disable-next-line
    CONTACTS_ROUTE, SPECIALS_ROUTE, SUPPORT_ROUTE, SCROLL_TOP, SCROLL_TOP_MOBILE 
} from '../../../utils/consts'
import scrollUp from '../../../utils/scrollUp'
import Search from '../../search/Search'

import './Top.css'


const Top = () => {
    
    const history = useHistory()

    const onClickBox = (route, scroll = 0) => {
        if (! scroll) {
            if (window.innerWidth > 575) scroll = SCROLL_TOP
            else scroll = SCROLL_TOP_MOBILE
        }
        history.push(route)
        scrollUp(scroll) 
    }
    

    return (
        <div id="top" className="Top">
            <Container className="TopContainer">
                <div className="TopRow">
                    <div 
                        className="TopCol TopColLink _hidden-mobile" 
                    >
                        <div className="TopDivLink">
                            <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top_Shop"
                                    onClick={()=>onClickBox(SHOP_ROUTE)}
                                >
                                    Продукция
                                </div>
                            </strong>
                            <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top_Dealer"
                                    onClick={()=>onClickBox(DEALER_ROUTE)}
                                >
                                    Дилерам
                                </div>
                            </strong>
                            <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top"
                                    onClick={()=>onClickBox(PAYMENT_ROUTE)}
                                >
                                    Оплата
                                </div>
                            </strong>
                            <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top_Specials"
                                    onClick={()=>onClickBox(SPECIALS_ROUTE)}
                                >
                                    Акции
                                </div>
                            </strong>
                            <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top"
                                    // to={DELIVERY_ROUTE}
                                    onClick={()=>onClickBox(DELIVERY_ROUTE)}
                                >
                                    Доставка
                                </div>
                            </strong>
                            {/* <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top"
                                    onClick={()=>onClickBox(CONTACTS_ROUTE)}
                                >
                                    Контакты
                                </div>
                            </strong> */}
                            <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top_Support"
                                    onClick={()=>onClickBox(SUPPORT_ROUTE)}
                                >
                                    Тех. поддержка
                                </div>
                            </strong>
                        </div>
                    </div>

                    <div 
                        className="TopCol TopColSearch" 
                    >
                        <Search />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Top
