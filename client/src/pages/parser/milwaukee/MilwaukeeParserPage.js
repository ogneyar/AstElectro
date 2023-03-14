// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import HtmlReactParser from 'html-react-parser'

import { mlkAddProduct, mlkChangePriceAll, mlkGetLength } from '../../../http/parser/milwaukeeAPI';

import Loading from '../../../components/Loading';
import { observer } from 'mobx-react-lite';
import InfoPage from '../../info/InfoPage';

import './MilwaukeeParserPage.css'


const MilwaukeeParserPage = observer((props) => {

    const [feed, setFeed] = useState(null)
    const [checkFeed, setCheckFeed] = useState(false)

    const [value, setValue] = useState(0)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    

    // обновление цен
    const onClickButtonChangePricesMLK = async () => {
        setMessage("")
        // if (! feed ) {
        //     setMessage("Файл пуст")
        //     return
        // }
        setLoading(true)
        
        const formData = new FormData()
        if (feed) {
            formData.append("feed", feed)
        }
        
        await mlkChangePriceAll(formData, value)
            .then(data => {
                if (data?.error) {
                    setMessage(data.error)
                }else {
                    setMessage(data)
                }
            })
            .catch(error => {
                setMessage(JSON.stringify(error))
            })
        setLoading(false)
    }

    // добавление товаров
    const onClickButtonAddNewProduct = async () => {
        setMessage("")
        setLoading(true)

        // if (! feed ) {
        //     setMessage("Файл пуст")
        //     return
        // }

        const formData = new FormData()
        if (feed) {
            formData.append("feed", feed)
        }

        let mess = ""
        
        // eslint-disable-next-line
        if ( value == 0 ) {

            let length = await mlkGetLength(formData)
            let party = 10

            for(let i = 1; i < length; i = i + party) {
                await mlkAddProduct(formData, i, party)
                    // eslint-disable-next-line
                    .then(data => {
                        mess += data
                    })
                    // eslint-disable-next-line
                    .finally(() => {
                        setMessage(mess)
                    })
            }

        }else {
            await mlkAddProduct(formData, value, 0)
                // eslint-disable-next-line
                .then(data => {
                    mess += data
                })
                // eslint-disable-next-line
                .finally(() => {
                    setMessage(mess)
                })
        }

        setLoading(false)
    }

    
    return (
        <InfoPage>
            <div className="MilwaukeeParserPage">
                
                {message && message !== ""
                ?
                    <div className="MilwaukeeParserPage_inputBox">
                        {HtmlReactParser(message)}
                    </div>

                : null}

                {loading ? <Loading /> 
                : 
                <>
                    <label>Заведение новых товаров Milwaukee на сайт!</label>
                    <label>Или обновление цен!</label>
                    <div className="MilwaukeeParserPage_box">
                        <span>Файл с товарами</span>
                        <input 
                            type="file"
                            className="MilwaukeeParserPage_box_file" 
                            onChange={(e) => setFeed(e.target.files[0])} 
                            placeholder="Выберите файл" 
                            disabled={checkFeed}
                        />
                        <div 
                            className="MilwaukeeParserPage_box_div"
                            onClick={() => setCheckFeed(!checkFeed)}
                        >
                            <input 
                                type="checkbox"
                                className="MilwaukeeParserPage_box_checkbox" 
                                // onChange={() => setCheckFeed(!checkFeed)} 
                                checked={checkFeed}
                            />&nbsp;
                            использовать файл на сервере (feed.xlsx)
                        </div>

                        <hr />
                        
                        <span>Номер позиции (0 - для добавления всех товаров)</span>
                        <input 
                            className="MilwaukeeParserPage_box_input"
                            type="text" 
                            value={value} 
                            onChange={(e) => setValue(e.target.value)} 
                        />
                        
                        <button 
                            disabled={ (! feed && ! checkFeed)}
                            className="m-3 p-2" 
                            onClick={onClickButtonAddNewProduct}
                        >
                            Добавить товары
                        </button>
                        
                        <label>или</label>
                            
                        <button 
                            disabled={ ! feed && ! checkFeed }
                            onClick={onClickButtonChangePricesMLK}
                        >
                            Обновить цены
                        </button>
                    </div>
                    
                </>}
                
                <br />

                <button 
                    className="MilwaukeeParserPage_button"
                    onClick={() => props?.setBrand("")} 
                >
                    назад
                </button>

            </div>

        </InfoPage>
    )

})

export default MilwaukeeParserPage;
