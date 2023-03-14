import React from 'react'
import $ from 'jquery'

import { NavLink } from '../myBootstrap'
import { SHOP_ROUTE } from '../../utils/consts'
import './End.css'

const End = () => {
    return (
        <div
            className="End"
        >
            <NavLink 
                className="NavLink FooterEnd_NavLink"
                to={SHOP_ROUTE}
            >
                © ООО "ЛеидТоги" {(new Date()).getFullYear()}
            </NavLink>

            <div 
                className="EndDiv NavLink FooterEnd_NavLink"
                style={{cursor:"pointer"}}
                onClick={() => {
                    $('html, body').animate(
                        {
                            scrollTop: 0
                        }, 
                        700, 
                        function(){}
                    )
                }}
            >
                <i className="EndDivArrow fa fa-arrow-circle-up"></i>
            </div>
        </div>
    )
}

export default End
