
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
                    Компания&nbsp;
                    <label>АСТ</label>&nbsp;
                    <span>является официальным дилером российского производителя кабельной арматуры АО «ЗЭТА» (Завод электротехнической арматуры): кабельные наконечники, кабельные вводы, муфты, металлорукава и изделия для их монтажа, продукция взрывозащищенного исполнения.</span>
                </div>

                <img src={URL + "/images/certificate/certificate.jpg"} /> 
            </div>
        </InfoWidePage>
    )
}

export default AboutUs
