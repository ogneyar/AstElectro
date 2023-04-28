
import { useContext } from 'react'
import { Navbar, Container, Image, Button, Nav } from 'react-bootstrap'
import HtmlReactParser from 'html-react-parser'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { NAME, ADDRESS, PHONE_ONE, MAIL, SCROLL_TOP, SCROLL_TOP_MOBILE, LOGIN_ROUTE, MAIN_ROUTE, ADMIN_ROUTE } from '../../../utils/consts'
import logo from '../../../assets/logo.png'
import scrollUp from '../../../utils/scrollUp'
import { logout } from '../../../http/userAPI'

import { Context } from '../../../'
import './NavBar.css'


const NavBar = observer(() => {

    const { userStore } = useContext(Context)

    const history = useHistory()

    const onClickLogoutButton = () => {
        userStore.setUser({})
        userStore.setIsAuth(false)
        logout()
        onClickAndScroll(MAIN_ROUTE)
    }

    const onClickAndScroll = (route, scroll = 0) => {
        // if (! scroll) {
        //     if (window.innerWidth > 575) scroll = SCROLL_TOP
        //     else scroll = SCROLL_TOP_MOBILE
        // }
        history.push(route)
        scrollUp(scroll) 
    }

    

    return (
        <Navbar 
            bg="secondary" 
            variant="secondary" 
            className="NavBar"
        >
            <Container 
                className="NavBar_Container"
            >
                <div
                    className="NavBar_Row"
                >
                    <div 
                        className="NavBar_Col_Logo"
                    >
                        <div className="NavLink NavBar_NavLink"
                            onClick={() => onClickAndScroll("/")}
                        >
                            <Image src={logo} className="NavBar_Logo" />
                        </div>
                    </div>

                    <div
                        className="NavBar_Col_Contacts"
                    >
                        <label className="NavBar_Col_Contacts_Name">{NAME}</label>
                        <label className="NavBar_Col_Contacts_Address">{ADDRESS}</label>
                        <label className="NavBar_Col_Contacts_Phone">{HtmlReactParser(PHONE_ONE)}</label>
                        <label className="NavBar_Col_Contacts_Mail">{HtmlReactParser(MAIL)}</label>
                    </div>
                    <div
                        className="NavBar_Col_Buttons"
                    >
                        <Nav>
                            {!userStore.isAuth
                            ?
                            <Button 
                                // onClick={() => onClickAndScroll(LOGIN_ROUTE + "?returnUrl=admin")}
                                onClick={() => onClickAndScroll(ADMIN_ROUTE)}
                                variant="outline-light"
                            >
                                Вход
                            </Button>
                            :
                            <>
                            <Button 
                                onClick={() => onClickAndScroll(ADMIN_ROUTE)}
                                variant="outline-light"
                            >
                                АП
                            </Button>&nbsp;
                            <Button 
                                onClick={onClickLogoutButton}
                                variant="outline-light"
                            >
                                Выход
                            </Button>
                            </>
                            }
                        </Nav>
                    </div>

                </div>
            </Container>
        </Navbar>
    )
})

export default NavBar
