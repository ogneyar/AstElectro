
// import { useEffect, useState } from 'react'
// import RealTop from './top/RealTop'
import NavBar from './navbar/NavBar'
import Top from './top/Top'
import Aside from './aside/Aside'

import './Header.css'


const Header = () => {

    return (
        <header
            className="Header"
        >
            {/* <RealTop /> */}
            <NavBar /> 
            <Top /> {/* // перенёс поиск вниз заголовка */}
            <Aside /> {/* // хлебные крошки тут */}
        </header>
    )
}

export default Header
