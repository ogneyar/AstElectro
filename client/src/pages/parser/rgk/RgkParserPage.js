import React, { useState } from 'react'
import HtmlReactParser from 'html-react-parser'
import { observer } from 'mobx-react-lite';

import { rgkGetLength, rgkAddNewProduct, rgkChangePrice, rgkAddAllProducts } from '../../../http/parser/rgkAPI';
import Loading from '../../../components/Loading';
import InfoPage from '../../info/InfoPage';



const RgkParserPage = observer((props) => {


    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    
    const [number, setNumber] = useState(0)
    

    const onClickButtonChangePricesRGK = async () => {
        setMessage("")
        setLoading(true)
        
        await rgkChangePrice()
            // eslint-disable-next-line
            .then(data => {
                if (data?.error) {
                    setMessage(data.error)
                }else {
                    setMessage(JSON.stringify(data))
                }
            })
            // eslint-disable-next-line
            .catch(error => {
                setMessage("(Ошибка) " + JSON.stringify(error))
            })
        setLoading(false)
    }
    
    const onClickButtonParserRGK = async () => {
        setMessage("")
        setLoading(true)
        let mess
        if (number > 0) {
            await rgkAddNewProduct(number).then(data => {
                setMessage(data)
            })
        }else {
            let length = await rgkGetLength(true)
            console.log(length);
            let quantity = 10
            mess = "Начало:"
            for(let i = 1; i <= length; i = i + quantity) {

                await rgkAddAllProducts(i, quantity)
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
                    <label>Заведение товаров RGK на сайт!</label>
                    <br />
                    <div className="ParserPage_box">

                        <span>Номер позиции (0 - для добавления всех товаров)</span>
                        <input 
                            className="ParserPage_box_input"
                            type="text" 
                            value={number} 
                            onChange={(e) => setNumber(e.target.value)} 
                        />
                        
                        <button
                            className="m-3 p-2" 
                            onClick={onClickButtonParserRGK}
                        >
                            Добавить товары
                        </button>
                    </div>

                    <br />

                    <label>Обновление цен!</label>
                    <br />
                    <div className="ParserPage_box">
                        <button 
                            onClick={onClickButtonChangePricesRGK}
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

export default RgkParserPage;
