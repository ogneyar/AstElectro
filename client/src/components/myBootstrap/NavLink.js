import React from 'react'
import { NavLink } from 'react-router-dom'
import $ from 'jquery'

import './NavLink.css'


const NavLinker = (props) => {
    
    let className = "NavLink "
    if (props?.className) className = className + props.className

    return (
        <NavLink className={className}
            to={props.to}
            onClick={() => {
                // window.scrollTo(0,0)
                $('html, body').animate(
                    {
                        scrollTop: 0
                    }, 
                    700, 
                    function(){}
                )
            }}
        >
            {props?.children}
        </NavLink>
    )
}

export default NavLinker
