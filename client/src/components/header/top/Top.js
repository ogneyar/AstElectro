
import React from 'react'
import { useHistory } from 'react-router-dom'

import { Container } from '../../myBootstrap'
import { 
    SHOP_ROUTE, DELIVERY_ROUTE, SCROLL_TOP, SCROLL_TOP_MOBILE 
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
                    {/* <div 
                        className="TopCol TopColLink _hidden-mobile" 
                    >
                        <div className="TopDivLink">
                            <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top_Shop"
                                    onClick={()=>onClickBox(SHOP_ROUTE)}
                                >
                                    О компании
                                </div>
                            </strong>                           
                            <strong className="TopLinkStrong">
                                <div
                                    className="NavLink NavLink_Top_Support"
                                    onClick={()=>onClickBox(DELIVERY_ROUTE)}
                                >
                                    О доставке
                                </div>
                            </strong>
                        </div>
                    </div> */}

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
