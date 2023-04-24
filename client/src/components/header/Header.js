
import Top from './top/Top'
import NavBar from './navbar/NavBar'
import Aside from './aside/Aside'

import './Header.css'


const Header = () => {
    return (
        <header
            className="Header"
        >
            <NavBar />
            <Top /> {/* // перенёс поиск вниз заголовка */}
            <Aside />
        </header>
    )
}

export default Header
