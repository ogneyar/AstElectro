
// import { Container, Card } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

import { SCROLL_TOP, SCROLL_TOP_MOBILE, SHOP_ROUTE } from '../../utils/consts'
import scrollUp from '../../utils/scrollUp'

import './InfoWidePage.css'


const InfoWidePage = (props) => {
    return (
        <div 
            className="InfoWidePage"
        >            
            <div 
                className="InfoWidePage_Card"
                style={props?.width && {width: props?.width}}
            >
                <div className="InfoWidePage_CardBody">
                    {props?.children}
                </div>
                <div className="InfoWidePage_CardFooter">
                    Поcетить &nbsp;
                    <NavLink
                        className="NavLink"
                        to={SHOP_ROUTE}
                        onClick={() => scrollUp(window.innerWidth > 700 ? SCROLL_TOP : SCROLL_TOP_MOBILE)}
                    >
                        магазин!
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default InfoWidePage
