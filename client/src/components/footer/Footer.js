import React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import FooterLogo from './FooterLogo'
import FooterInformation from './FooterInformation'
// eslint-disable-next-line
import FooterSocialNetwork from './FooterSocialNetwork'
import FooterContacts from './FooterContacts'
import End from './End'

import './Footer.css'


const Footer = observer(() => {

    return (
        <>
            <Navbar 
                bg="secondary" 
                variant="secondary" 
                className="Footer" 
                id="Footer"
            >      
                <Container
                    className="FooterContainer text-center border-secondary"
                >
                    <div className="FooterRow">
                        <div className="FooterLogo" >
                            <FooterLogo />
                        </div>    
                        <div className="FooterCol" md={3}>
                            <FooterInformation />
                        </div>
                        <div className="FooterCol" md={3}>
                            <FooterSocialNetwork />
                        </div>
                        <div className="FooterCol" md={3}>
                            <FooterContacts />
                        </div>
                    </div>
                </Container>
            </Navbar>

            <End />
        </>
    )
})

export default Footer
