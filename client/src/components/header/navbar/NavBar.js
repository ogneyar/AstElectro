import React, { useContext, useState, useEffect } from 'react'
import { Spinner, Navbar, Nav, Button, Container, Image } from 'react-bootstrap'
import HtmlReactParser from 'html-react-parser'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

// import { NavLink } from '../myBootstrap'
import { 
    ADMIN_ROUTE, LOGIN_ROUTE, CART_ROUTE, LK_ROUTE, NAME, 
    ADDRESS, PHONE_ONE, MAIL, SCROLL_TOP, SCROLL_TOP_MOBILE 
} from '../../../utils/consts'
import logo from '../../../assets/logo.png'
import basket from '../../../assets/cart.png'
import { logout } from '../../../http/userAPI'
import scrollUp from '../../../utils/scrollUp'

import { Context } from '../../..'
import './NavBar.css';


const NavBar = observer(() => {

    const { userStore, cartStore } = useContext(Context)
    const history = useHistory()

    const onClickLogoutButton = () => {
        userStore.setUser({})
        userStore.setIsAuth(false)
        // localStorage.removeItem('token') 
        logout()
        // history.push(LOGIN_ROUTE)
        onClickAndScroll(LOGIN_ROUTE)
    }

    const onClickAndScroll = (route, scroll = 0) => {
        if (! scroll) {
            if (window.innerWidth > 575) scroll = SCROLL_TOP
            else scroll = SCROLL_TOP_MOBILE
        }
        history.push(route)
        scrollUp(scroll) 
    }

    const [ quantity, setQuantity ] = useState(0)

    useEffect(() => {
        if (cartStore?.cart) {
            setQuantity(cartStore?.cart?.length)
        }
    },[cartStore?.cart])


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
                        {/* <NavLink className="NavLink NavBar_NavLink" */}
                        <div className="NavLink NavBar_NavLink"
                            // to="/"
                            onClick={() => onClickAndScroll("/")}
                        >

                            <Image src={logo} className="NavBar_Logo" />

                            <div 
                                className="hidden-mobile"
                            >
                                Стройте с нами, экономьте время
                            </div>
                            
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
                            {/* <NavLink className="NavLink NavBar_Cart" */}
                            <div className="NavLink NavBar_Cart"
                                // to={CART_ROUTE}
                                onClick={() => onClickAndScroll(CART_ROUTE)}
                            >
                                <div className="NavBar_Cart_Box">

                                    <Image className="NavBar_Cart_Image" src={basket} />
                                    
                                   {quantity !== 0 && <span>{quantity}</span>}

                                </div>
                            </div>
                        <Nav>
                            {userStore.loading
                            ?
                            <div className="NavBar_Spinner">
                                <Spinner animation="border" variant="light" />
                            </div>
                            :
                            
                                userStore.isAuth && userStore.user?.role ?
                            
                                <>
                                    {userStore.user?.role === 'ADMIN' ? 
                                    <>
                                        <Button 
                                            variant={'outline-light'} 
                                            // onClick={() => history.push(ADMIN_ROUTE)}
                                            onClick={() => onClickAndScroll(ADMIN_ROUTE)}
                                        >
                                            АП
                                        </Button>
                                        <Button 
                                            variant={'outline-light'} 
                                            // onClick={() => history.push(LK_ROUTE)}
                                            onClick={() => onClickAndScroll(LK_ROUTE)}
                                            className="ml-2"
                                        >
                                            ЛК
                                        </Button>
                                    </>
                                    : 
                                        <Button 
                                            variant={'outline-light'} 
                                            // onClick={() => history.push(LK_ROUTE)}
                                            onClick={() => onClickAndScroll(LK_ROUTE)}
                                        >
                                            Личный Кабинет
                                        </Button>
                                    }
                                    
                                    <Button 
                                        variant={'outline-light'} 
                                        onClick={onClickLogoutButton} 
                                        className="ml-2"
                                    >
                                        Выйти
                                    </Button>
                                </>
                            :
                            

                                <Button 
                                    // onClick={() => history.push(LOGIN_ROUTE + "?returnUrl=" + history?.location?.pathname)}
                                    onClick={() => onClickAndScroll(LOGIN_ROUTE + "?returnUrl=" + history?.location?.pathname)}
                                    variant={'outline-light'}
                                >
                                    Авторизация
                                </Button>
                            
                            }

                        </Nav>
                    </div>
                </div>
            </Container>
        </Navbar>
    )
})

export default NavBar
