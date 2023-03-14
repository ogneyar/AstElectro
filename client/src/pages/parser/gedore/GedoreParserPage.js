import React, { useState } from 'react'
import HtmlReactParser from 'html-react-parser'
import { observer } from 'mobx-react-lite';
// eslint-disable-next-line
import { addProduct, getLength, changePrices } from '../../../http/parser/gedoreAPI'
import Loading from '../../../components/Loading';
import InfoPage from '../../info/InfoPage';

import './GedoreParserPage.css'


const GedoreParserPage = observer((props) => {
    
    const [ feed, setFeed ] = useState(null)
    const [ checkFeed, setCheckFeed ] = useState(false)
    const [ checkUpdatePrice, setCheckUpdatePrice ] = useState(false)
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
            await addProduct(formData, number).then(data => {
                setMessage(data)
            })
        }else {
            let length = await getLength(formData)
            let quantity = 10
            mess = "Начало:"
            for(let i = 1; i <= length; i = i + quantity) {

                await addProduct(formData, i, quantity)
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
        await changePrices(formData)
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
            <div className="GedoreParserPage"> 
                 
                {message && message !== ""
                ?
                <>
                    <div className="GedoreParserPage_inputBox">
                        {HtmlReactParser(message)}
                    </div>
                    <br />
                </>
                : null}
                
                {loading ? <Loading /> 
                : 
                <>
                    <label>Заведение товаров Gedore на сайт!</label>
                    <br />
                    <div className="GedoreParserPage_box">
                        <span>Файл с товарами</span>
                        <input 
                            type="file"
                            className="GedoreParserPage_box_file" 
                            onChange={(e) => setFeed(e.target.files[0])} 
                            placeholder="Выберите файл" 
                            disabled={checkFeed}
                        />
                        <div 
                            className="GedoreParserPage_box_div"
                            onClick={() => setCheckFeed(!checkFeed)}
                        >
                            <input 
                                type="checkbox"
                                className="GedoreParserPage_box_checkbox"
                                checked={checkFeed}
                            />&nbsp;
                            использовать файл на сервере (feed.xlsx)
                        </div>
                        <hr />

                        <span>Номер позиции (0 - для добавления всех товаров)</span>
                        <input 
                            className="GedoreParserPage_box_input"
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
                    <div className="GedoreParserPage_box">
                        <span>Файл с ценами</span>
                        <input 
                            type="file" 
                            className="GedoreParserPage_box_file" 
                            onChange={(e) => setFeed(e.target.files[0])} 
                            placeholder="Выберите файл" 
                            disabled={ checkUpdatePrice }
                        />
                        <div 
                            className="GedoreParserPage_box_div"
                            onClick={() => setCheckUpdatePrice(!checkUpdatePrice)}
                        >
                            <input 
                                type="checkbox"
                                className="GedoreParserPage_box_checkbox" 
                                checked={checkUpdatePrice}
                            />&nbsp;
                            использовать файл на сервере (feed.xlsx)
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
                    className="GedoreParserPage_button" 
                    onClick={() => props?.setBrand("")}
                >
                    назад
                </button>

            </div>
        </InfoPage>
    )


})

export default GedoreParserPage;
