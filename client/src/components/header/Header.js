
import React from 'react'

import Top from './top/Top'
import NavBar from './navbar/NavBar'
import Address from './address/Address'
import Aside from './aside/Aside'
// eslint-disable-next-line
import Banner from './banner/Banner'
// eslint-disable-next-line
import Carousel from './carousel/Carousel'
import LineMenu from '../lineMenu/LineMenu'

import './Header.css'


const Header = () => {
    return (
        <header
            className="Header"
        >
            <Top />
            <NavBar />  {/* Адрес есть и тут /> */}
            <Address /> {/* и тут /> */}
            {/* <Banner /> */}
            {/* <Carousel /> */}
            <Aside />

            {window.location.host === "192.168.0.244:3000" &&
                <LineMenu /> // Добавил эту строку для тестирования LineMenu со смартфона
            }

        </header>
    )
}

export default Header
