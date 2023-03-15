
import Top from './top/Top'
import NavBar from './navbar/NavBar'
import Aside from './aside/Aside'

import './Header.css'


const Header = () => {
    return (
        <header
            className="Header"
        >
            <Top />
            <NavBar />
            <Aside />
        </header>
    )
}

export default Header
