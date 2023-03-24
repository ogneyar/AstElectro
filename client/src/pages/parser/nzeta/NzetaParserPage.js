
import React, { useState } from 'react'
import HtmlReactParser from 'html-react-parser'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

import Loading from '../../../components/Loading'
import InfoPage from '../../info/InfoPage'
import scrollUp from '../../../utils/scrollUp'
import { UPDATE_PRODUCTS_ROUTE, UPDATE_PRICES_ROUTE, SCROLL_TOP, SCROLL_TOP_MOBILE } from '../../../utils/consts'

import './NzetaParserPage.css'


const NzetaParserPage = observer((props) => {
    
    const history = useHistory()

    const [ message, setMessage ] = useState("")
    const [ loading, setLoading ] = useState(false)


    const onClickButtonAddNewProduct = () => {
        history.push(UPDATE_PRODUCTS_ROUTE + "?token=" + process.env.REACT_APP_TOKEN_UPDATES)
        scrollUp(window.innerWidth > 575 ? SCROLL_TOP : SCROLL_TOP_MOBILE)
    }

    // оновление цен
    let onClickButtonChangePrices = () => {
        history.push(UPDATE_PRICES_ROUTE + "?token=" + process.env.REACT_APP_TOKEN_UPDATES)
        scrollUp(window.innerWidth > 575 ? SCROLL_TOP : SCROLL_TOP_MOBILE)
    }


    return (
        <InfoPage>
            <div className="NzetaParserPage"> 
                
                {message && message !== ""
                ?
                <>
                    <div className="NzetaParserPage_inputBox">
                        {HtmlReactParser(message)}
                    </div>
                    <br />
                </>
                : null}
                
                {loading ? <Loading /> 
                : 
                <>
                    <label>Заведение товаров nZeta на сайт!</label>
                    <br />
                    <div className="NzetaParserPage_box">
                        
                        <button 
                            className="m-3 p-2" 
                            onClick={onClickButtonAddNewProduct}
                        >
                            Добавить/Обновить товары
                        </button>
                    </div>

                    <br />

                    <label>Обновление цен!</label>
                    <br />
                    <div className="NzetaParserPage_box">

                        <button 
                            onClick={onClickButtonChangePrices}
                        >
                            Обновить цены
                        </button>

                    </div>

                    <br />

                </>}

                <button 
                    className="NzetaParserPage_button" 
                    onClick={() => props?.setBrand("")}
                >
                    назад
                </button>

            </div>
        </InfoPage>
    )


})

export default NzetaParserPage
