import React, { useState } from 'react'
import HtmlReactParser from 'html-react-parser'
import { observer } from 'mobx-react-lite';
// eslint-disable-next-line
import { addProduct, getLength, changePrices } from '../../../http/parser/leidtogiAPI'
import Loading from '../../../components/Loading';
import InfoPage from '../../info/InfoPage';

import './LeidTogiParserPage.css'


const LeidTogiParserPage = observer((props) => {
    
    const [ feed, setFeed ] = useState(null)
    const [ checkFeed, setCheckFeed ] = useState(false)
    const [ numberSheet, setNumberSheet ] = useState(2)
    const [ checkUpdatePrice, setCheckUpdatePrice ] = useState(false)
    const [ numberSheetPrice, setNumberSheetPrice ] = useState(1)
    const [ message, setMessage ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ number, setNumber ] = useState(0)


    const onClickButtonAddNewProduct = async () => {
        setMessage("")
        const formData = new FormData()
        if (feed) {
            formData.append("feed", feed)
        }
        setLoading(true)
        let mess
        if (number > 0) {
            await addProduct(formData, number, numberSheet).then(data => {
                setMessage(data)
            })
        }else {
            let length = await getLength(formData, numberSheet)
            let quantity = 10
            mess = "Начало:"
            for(let i = 1; i <= length; i = i + quantity) {

                await addProduct(formData, i, quantity, numberSheet)
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
        // alert("Не реализованно (:")
        setMessage("")
        const formData = new FormData()
        if (feed) {
            formData.append("feed", feed)
        }
        setLoading(true)
        await changePrices(formData, numberSheetPrice)
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
            <div className="LeidTogiParserPage"> 
                
                {message && message !== ""
                ?
                <>
                    <div className="LeidTogiParserPage_inputBox">
                        {HtmlReactParser(message)}
                    </div>
                    <br />
                </>
                : null}
                
                {loading ? <Loading /> 
                : 
                <>
                    <label>Заведение товаров LeidTogi на сайт!</label>
                    <br />
                    <div className="LeidTogiParserPage_box">
                        <span>Файл с товарами</span>
                        <input 
                            type="file"
                            className="LeidTogiParserPage_box_file" 
                            onChange={(e) => setFeed(e.target.files[0])} 
                            placeholder="Выберите файл" 
                            disabled={checkFeed}
                        />
                        <div 
                            className="LeidTogiParserPage_box_div"
                            onClick={() => setCheckFeed(!checkFeed)}
                        >
                            <input 
                                type="checkbox"
                                className="LeidTogiParserPage_box_checkbox"
                                checked={checkFeed}
                            />&nbsp;
                            использовать файл на сервере (feed.xlsx)
                        </div>
                        <hr />

                        <span>Тип товара</span>
                        <div 
                            className="LeidTogiParserPage_box_div_numbersheet"
                        >
                            <span
                                onClick={() => setNumberSheet(1)}
                                className="LeidTogiParserPage_box_radio"
                            >
                                <input 
                                    type="radio"
                                    name="number_sheet"
                                    checked={numberSheet === 1}
                                />&nbsp;
                                Абразив
                            </span>
                            <span
                                onClick={() => setNumberSheet(2)}
                                className="LeidTogiParserPage_box_radio"
                            >
                                <input 
                                    type="radio"
                                    name="number_sheet"
                                    checked={numberSheet === 2}
                                />&nbsp;
                                Алмаз
                            </span>
                        </div>
                        <hr />

                        <span>Номер позиции (0 - для добавления всех товаров)</span>
                        <input 
                            className="LeidTogiParserPage_box_input"
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
                    <div className="LeidTogiParserPage_box">
                        <span>Файл с ценами</span>
                        <input 
                            type="file" 
                            className="LeidTogiParserPage_box_file" 
                            onChange={(e) => setFeed(e.target.files[0])} 
                            placeholder="Выберите файл" 
                            disabled={ checkUpdatePrice }
                        />
                        <div 
                            className="LeidTogiParserPage_box_div"
                            onClick={() => setCheckUpdatePrice(!checkUpdatePrice)}
                        >
                            <input 
                                type="checkbox"
                                className="LeidTogiParserPage_box_checkbox" 
                                checked={checkUpdatePrice}
                            />&nbsp;
                            использовать файл на сервере (feed.xlsx)
                        </div>
                        <hr />
                        
                        <span>Тип товара</span>
                        <div 
                            className="LeidTogiParserPage_box_div_numbersheet"
                        >
                            <span
                                onClick={() => setNumberSheetPrice(1)}
                                className="LeidTogiParserPage_box_radio"
                            >
                                <input 
                                    type="radio"
                                    name="number_sheet_price"
                                    checked={numberSheetPrice === 1}
                                />&nbsp;
                                Абразив
                            </span>
                            <span
                                onClick={() => setNumberSheetPrice(2)}
                                className="LeidTogiParserPage_box_radio"
                            >
                                <input 
                                    type="radio"
                                    name="number_sheet_price"
                                    checked={numberSheetPrice === 2}
                                />&nbsp;
                                Алмаз
                            </span>
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
                    className="LeidTogiParserPage_button" 
                    onClick={() => props?.setBrand("")}
                >
                    назад
                </button>

            </div>
        </InfoPage>
    )


})

export default LeidTogiParserPage;
