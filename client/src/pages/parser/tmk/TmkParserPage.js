import React, { useState } from 'react'
import HtmlReactParser from 'html-react-parser'
import { observer } from 'mobx-react-lite';
// eslint-disable-next-line
import { addProduct, getLength, changePrices } from '../../../http/parser/parserAPI'
import Loading from '../../../components/Loading';
import InfoPage from '../../info/InfoPage';

import '../ParserPage.css'


const TmkParserPage = observer((props) => {
    
    const [ feed, setFeed ] = useState(null)
    const [ checkFeed, setCheckFeed ] = useState(false)
    // eslint-disable-next-line
    const [ checkUpdatePrice, setCheckUpdatePrice ] = useState(true)
    const [ message, setMessage ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ number, setNumber ] = useState(0)

    
    const onClickButtonAddNewProduct = async () => {
        setMessage("")
        const formData = new FormData()
        if (feed && !checkFeed) {
            formData.append("feed", feed)
        }
        setLoading(true)
        let mess
        if (number > 0) {
            await addProduct({brand: props.brand, formData, number}).then(data => {
                setMessage(data)
            })
        }else {
            let length = await getLength({brand: props.brand, formData})
            let quantity = 10
            mess = "Начало:"
            for(let i = 1; i <= length; i = i + quantity) {

                await addProduct({brand: props.brand, formData, number: i, quantity})
                    // eslint-disable-next-line
                    .then(data => {
                        if (data?.error) {
                            mess += "<br />" + i + ": " + data.error
                        }else {
                            mess += "<br />" + data.map(i => i + "<br />").join("")
                        }
                    })
                    // eslint-disable-next-line
                    .catch(error => {
                        mess += "<br />" + i + ": (Ошибка) " + JSON.stringify(error)
                    })
                    // eslint-disable-next-line
                    .finally(() => {
                        setMessage(mess)
                    })

            }
            
        }
        if (mess) setMessage(mess + "<br />Конец.")
        setLoading(false)
    }

    // оновление цен
    let onClickButtonChangePrices = async () => {
        setMessage("")
        const formData = new FormData()
        if (feed && !checkUpdatePrice) {
            formData.append("feed", feed)
        }
        setLoading(true)
        await changePrices({brand: props.brand, formData})
            // eslint-disable-next-line
            .then(data => {
                if (data?.error) {
                    setMessage(data.error)
                    // console.log(data.error)
                }else {
                    setMessage(JSON.stringify(data))
                    // console.log(data)
                }
            })
            // eslint-disable-next-line
            .catch(error => {
                setMessage("(Ошибка) " + JSON.stringify(error))
                // console.log("(Ошибка) " + error)
            })
        setLoading(false)
    }


    return (
        <InfoPage>
            <div className="ParserPage"> 
                
                {message && message !== ""
                ?
                <>
                    <div className="ParserPage_inputBox">
                        {HtmlReactParser(message)}
                    </div>
                    <br />
                </>
                : null}
                
                {loading ? <Loading /> 
                : 
                <>
                    <label>Заведение товаров {props.brand.toUpperCase()} на сайт!</label>
                    <br />
                    <div className="ParserPage_box">
                        <span>Файл с товарами</span>
                        <input 
                            type="file"
                            className="ParserPage_box_file" 
                            onChange={(e) => setFeed(e.target.files[0])} 
                            placeholder="Выберите файл" 
                            disabled={checkFeed}
                        />
                        <div 
                            className="ParserPage_box_div"
                            onClick={() => setCheckFeed(!checkFeed)}
                        >
                            <input 
                                type="checkbox"
                                className="ParserPage_box_checkbox"
                                checked={checkFeed}
                                onChange={() => {}} 
                            />&nbsp;
                            использовать файл на сервере
                        </div>
                        <hr />

                        <span>Номер позиции (0 - для добавления всех товаров)</span>
                        <input 
                            className="ParserPage_box_input"
                            type="text" 
                            value={number} 
                            onChange={(e) => setNumber(e.target.value)} 
                        />
                        
                        <button 
                            disabled={! feed && ! checkFeed}
                            className="m-3 p-2" 
                            onClick={onClickButtonAddNewProduct}
                        >
                            Добавить товары
                        </button>
                    </div>

                    <br />

                    <label>Обновление цен!</label>
                    <br />
                    <div className="ParserPage_box">
                        <span>Файл с ценами</span>
                        <input 
                            type="file" 
                            className="ParserPage_box_file" 
                            onChange={(e) => setFeed(e.target.files[0])} 
                            placeholder="Выберите файл" 
                            disabled={ checkUpdatePrice }
                        />
                        <div 
                            className="ParserPage_box_div"
                            //onClick={() => setCheckUpdatePrice(!checkUpdatePrice)}
                        >
                            <input 
                                type="checkbox"
                                className="ParserPage_box_checkbox" 
                                checked={checkUpdatePrice}
                                onChange={() => {}} 
                            />&nbsp;
                            использовать файл на сервере
                        </div>
                        <hr />
                        <button 
                            disabled={ ! feed && ! checkUpdatePrice }
                            onClick={onClickButtonChangePrices}
                        >
                            Обновить цены
                        </button>

                    </div>

                    <br />

                </>}

                <button 
                    className="ParserPage_button" 
                    onClick={() => props?.setBrand("")}
                >
                    назад
                </button>

            </div>
        </InfoPage>
    )


})

export default TmkParserPage
