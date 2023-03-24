
import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

import InfoPage from '../info/InfoPage'
// import LeidTogiParserPage from './leidtogi/LeidTogiParserPage'
import NzetaParserPage from './nzeta/NzetaParserPage'
import { ADMIN_ROUTE, SCROLL_TOP, SCROLL_TOP_MOBILE, LOGIN_ROUTE, PARSER_ROUTE } from '../../utils/consts'
import scrollUp from '../../utils/scrollUp';

import { Context } from '../../'
import './ParserPage.css'


const ParserPage = observer(() => {

    const { userStore } = useContext(Context)

    const [ brand, setBrand ] = useState("")

    const history = useHistory()

    const setBrandAndScroll = (name) => {
        setBrand(name)
        scrollUp(window.innerWidth < 700 ? SCROLL_TOP_MOBILE : SCROLL_TOP)
    }

    if (!userStore.isAuth) {
        history.push(LOGIN_ROUTE + "?returnUrl=" + PARSER_ROUTE)
        scrollUp(scroll) 
    }
    
    if (brand === "") 
    return (
        <InfoPage>
            <div className="ParserPage_Header">
                <label>Заведение товаров на сайт</label>
                <label>и обновление цен!</label>
                <button onClick={() => setBrandAndScroll("nzeta")} className="ParserPage_Header_green">nZeta</button>
                {/* <button onClick={() => setBrandAndScroll("milwaukee")} >Milwaukee</button> */}
                <br />
                <button onClick={() => history.push(ADMIN_ROUTE)} >Назад</button>
            </div>
        </InfoPage>
    )
        
    if (brand === "nzeta") return <NzetaParserPage setBrand={setBrandAndScroll} />


})

export default ParserPage
