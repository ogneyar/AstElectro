
import React from 'react'
import { Navbar, Image, Container } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import { MAIN_ROUTE } from '../../../utils/consts'
import scrollUp from '../../../utils/scrollUp'
import logo from '../../../assets/logoSvg/AST3.svg'

import './RealTop.css'


const RealTop = () => {
    
    const history = useHistory()

    const onClickAndScroll = (route, scroll = 0) => {
        history.push(route)
        scrollUp(scroll) 
    }

    return (      
        <div
            className="RealTop"
        >
            {/* <Navbar  */}
            <div
                bg="secondary" 
                variant="secondary" 
                className="RealTop_Navbar"
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
            {/* </Navbar> */}
            </div>
        </div>
    )
}

export default RealTop
