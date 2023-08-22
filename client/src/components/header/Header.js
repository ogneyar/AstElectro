
import { useEffect, useState } from 'react'
import RealTop from './top/RealTop'
import NavBar from './navbar/NavBar'
import Top from './top/Top'
import Aside from './aside/Aside'

import './Header.css'


const Header = () => {

    const [ visibleRealTop, setVisibleRealTop ] = useState(false)

    useEffect(() => {

        if (window.innerWidth <= "768") {
            setVisibleRealTop(true)
        }else {
            setVisibleRealTop(false)
        }

    },[window.innerWidth])


    return (
        <header
            className="Header"
        >
            {/* {visibleRealTop && <RealTop />} */}
            <RealTop />
            <NavBar />
            <Top /> {/* // перенёс поиск вниз заголовка */}
            <Aside />
        </header>
    )
}

export default Header
