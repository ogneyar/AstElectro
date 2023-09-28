
import { useContext } from 'react'
import { Navbar, Container, Image, Button, Nav } from 'react-bootstrap'
import HtmlReactParser from 'html-react-parser'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { NAME, ADDRESS, PHONE_ONE, PHONE_TWO, MAIL, MAIL_TWO, MAIN_ROUTE, ADMIN_ROUTE } from '../../../utils/consts'
import scrollUp from '../../../utils/scrollUp'
import { logout } from '../../../http/userAPI'
import CallBack from '../../callback/CallBack'

// import logo from '../../../assets/logo.png'
// import logo from '../../../assets/logoSvg/AST1.svg'
// import logo from '../../../assets/logoSvg/AST2.svg'
import logo from '../../../assets/logoSvg/AST3.svg' 
// import logo from '../../../assets/logoSvg/AST4.svg'

import { mailClick, telClick } from '../../../service/yandexMetrika/reachGoal'

import { Context } from '../../../'
import './NavBar.css'
import WholesaleSheet from '../../callback/WholesaleSheet'


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
        history.push(route)
        scrollUp(scroll) 
    }

    

    return (
        // <Navbar 
        <div
            bg="secondary" 
            variant="secondary" 
            className="NavBar"

        >
            <Container
                    className="RealTop_Container"
                >
                    <div className="RealTop_Row">
                        <div className="RealTop_Image"
                            onClick={() => onClickAndScroll(MAIN_ROUTE)}
                        >
                            <Image src={logo} className="RealTop_Logo" width={"100"} />
                        </div>
                        <div 
                            className="RealTop_Col" 
                        >
                            Оптовая продажа электротехнической продукции
                        </div>
                    </div>
            </Container>
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
                            onClick={() => onClickAndScroll(MAIN_ROUTE)}
                        >
                            <Image src={logo} className="NavBar_Logo" />
                        </div>
                    </div>

                    <div 
                        className="NavBar_Col_Description"
                    >
                        <strong>Оптовая</strong> продажа электротехнической продукции
                    </div> 

                    <div
                        className="NavBar_Col_Contacts"
                    >
                        <label className="NavBar_Col_Contacts_Name">
                            {NAME}
                        </label>
                        <label className="NavBar_Col_Contacts_Address">
                            {ADDRESS}
                        </label>
                        <label 
                            className="NavBar_Col_Contacts_Phone NavBar_phone"
                            onClick={telClick}
                        >
                            {HtmlReactParser(PHONE_ONE)}
                        </label>
                        <label 
                            className="NavBar_Col_Contacts_Phone NavBar_phoneTwo"
                            onClick={telClick}
                        >
                            {HtmlReactParser(PHONE_TWO)}
                        </label>
                        <label 
                            className="NavBar_Col_Contacts_Mail NavBar_mailTwo"
                            onClick={mailClick}
                        >
                            {HtmlReactParser(MAIL_TWO)} 
                        </label>
                        <label 
                            className="NavBar_Col_Contacts_Mail NavBar_mail"
                            onClick={mailClick}
                        >
                            {HtmlReactParser(MAIL)} 
                        </label>
                        {/* <CallBack /> */}
                        <WholesaleSheet />
                    </div>
                    
                    {/* Дополнительный элемент с права, появляющийся в планшетной версии */}
                    <div 
                        className="NavBar_Col_DoublePhones NavBar_Col_Contacts"
                    >
                        
                        <label 
                            className="NavBar_Col_DoublePhones_Phone"
                            onClick={telClick}
                        >
                            {HtmlReactParser(PHONE_ONE)}
                        </label>
                        <label 
                            className="NavBar_Col_DoublePhones_Phone"
                            onClick={telClick}
                        >
                            {HtmlReactParser(PHONE_TWO)}
                        </label>
                        <label 
                            className="NavBar_Col_DoublePhones_Mail"
                            onClick={mailClick}
                        >
                            {HtmlReactParser(MAIL_TWO)} 
                        </label>
                        <label 
                            className="NavBar_Col_DoublePhones_Mail"
                            onClick={mailClick}
                        >
                            {HtmlReactParser(MAIL)} 
                        </label>
                    </div> 

                    <div
                        className="NavBar_Col_Buttons"
                    >
                        <Nav>
                            {!userStore.isAuth
                            ?
                            <Button 
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
        {/* </Navbar> */}
        </div>
    )
})

export default NavBar
