
import React from 'react'

import InfoWidePage from './InfoWidePage'
import './AboutUs.css'
import { URL } from '../../utils/consts'


const AboutUs = () => {
    return (
        <InfoWidePage>
            <div className="AboutUs">
                <header>О компании.</header>
                <br />
                <div className="AboutUsHead">
                    <label>ООО «АСТ»</label>&nbsp;
                    <span>является официальным представителем АКЦИОНЕРНОГО ОБЩЕСТВА "ЗАВОД ЭЛЕКТРОТЕХНИЧЕСКОЙ АРМАТУРЫ"</span>
                </div>

                <img src={URL + "/images/certificate/certificate.jpg"} /> 
            </div>
        </InfoWidePage>
    )
}

export default AboutUs
