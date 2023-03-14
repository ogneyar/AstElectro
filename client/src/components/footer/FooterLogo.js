import React from 'react'
import { Image } from 'react-bootstrap'

import { NavLink } from '../myBootstrap'
import logo from '../../assets/logo.png'
import './FooterLogo.css'


const FooterLogo = () => {
    
    return (
        <div
            className="FooterLogo"
        >
            <NavLink className="NavLink"
                to="/"
            >
                <Image className="FooterLogoImage" src={logo} />
            </NavLink>
        </div> 
    )
}

export default FooterLogo
