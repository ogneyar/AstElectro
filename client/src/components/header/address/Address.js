import React from 'react'
import { Container } from 'react-bootstrap'
import HtmlReactParser from 'html-react-parser'

import { ADDRESS, MAIL, PHONE_ONE, CITY } from '../../../utils/consts'
import './Address.css'


const Address = () => {
    return (
        <div 
            className="AddressHeader"
        >
            <Container
                className="AddressHeaderContainer"
            >
                <span className="AddressHeaderContainerAddress">{ADDRESS}</span>
                <span className="AddressHeaderContainerCity">{CITY}</span>
                <span className="AddressHeaderContainerPhone">{HtmlReactParser(PHONE_ONE)}</span>
                <span className="AddressHeaderContainerMail">{HtmlReactParser(MAIL)}</span>
            </Container>
        </div>
    )
}

export default Address
