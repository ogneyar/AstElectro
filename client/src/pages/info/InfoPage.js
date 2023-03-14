import React from 'react'
import { Container, Card } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { SCROLL_TOP, SCROLL_TOP_MOBILE, SHOP_ROUTE } from '../../utils/consts'
import scrollUp from '../../utils/scrollUp'
import './InfoPage.css'


const InfoPage = (props) => {
    return (
        <Container 
            className="InfoPage"
        >            
            <Card 
                className="InfoPageCard"
                style={props?.width && {width: props?.width}}
            >
                <div className="InfoPageCardBody">
                    {props?.children}
                </div>
                <div className="InfoPageCardFooter">
                    Поcетить &nbsp;
                    <NavLink
                        className="NavLink"
                        to={SHOP_ROUTE}
                        onClick={() => scrollUp(window.innerWidth > 700 ? SCROLL_TOP : SCROLL_TOP_MOBILE)}
                    >
                        магазин!
                    </NavLink>
                </div>
            </Card>
        </Container>
    )
}

export default InfoPage
