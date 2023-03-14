import React, { useState } from 'react'
import HtmlReactParser from 'html-react-parser'
import { observer } from 'mobx-react-lite';
// eslint-disable-next-line
import { addProduct, getLength, changePrices } from '../../../http/parser/husqvarnaAPI'
import Loading from '../../../components/Loading';
import InfoPage from '../../info/InfoPage';

import './HusqvarnaParserPage.css'


const HusqvarnaParserPage = observer((props) => {

    const [feed, setFeed] = useState(null)

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
        
    // const [ article, setArticle ] = useState("9678968-01")
    
    const [ number, setNumber ] = useState(1)

    
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
                // console.log("data",data)
                setMessage(data)
            })
        }else {
            let length = await getLength(formData)
            mess = "Начало:"
            for(let i = 1; i <= length; i++) {
                await addProduct(formData, i)
                    // eslint-disable-next-line
                    .then(data => {
                        if (data?.error) {
                            mess += "<br />" + i + ": " + data.error
                            setMessage(i + ": " + data.error)
                            // console.log(i + ": " + data.error)
                        }else {
                            mess += "<br />" + i + ": " + JSON.stringify(data)
                            setMessage(i + ": " + JSON.stringify(data))
                            // console.log(i + ": " + data)
                        }
                    })
                    // eslint-disable-next-line
                    .catch(error => {
                        mess += "<br />" + i + ": (Ошибка) " + JSON.stringify(error)
                        setMessage(i + ": (Ошибка) " + JSON.stringify(error))
                        // console.log(i + ": (Ошибка) " + error)
                    })
            }
            // await addAllProducts(formData).then(data => {
            //     // console.log("data",data)
            //     setMessage(data)
            // })
        }
        if (mess) setMessage(mess + "<br />Конец.")
        setLoading(false)
    }

    const onClickButtonChangePrices = async () => {
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
            <div className="HusqvarnaParserPage">
                <label>Заведение товаров Husqvarna на сайт!</label>
                <label>Или обновление цен!</label>

                {/* {quantity && quantity !== 0
                ? "Общее количество товаров: " + quantity 
                : null}

                <br /> */}

 
                {message && message !== ""
                ?
                <>
                    <div className="inputBox">
                        {/* {number && number !== 0 && number < quantity
                        ? number + ": "
                        : null} */}
                        {HtmlReactParser(message)}
                    </div>
                    <br />
                </>
                : null}

                <input 
                    type="file" 
                    className="m-3" 
                    onChange={(e) => setFeed(e.target.files[0])} 
                    placeholder="Выберите файл" 
                />

                {loading ? <Loading /> 
                : 
                <>
                    {/* <input className="pl-3 pr-3" type="text" value={article} onChange={(e) => setArticle(e.target.value)} /> */}
                    <input 
                        className="m-3 pl-3 pr-3" 
                        type="text" 
                        value={number} 
                        onChange={(e) => setNumber(e.target.value)} 
                    />
                    <hr />
                    <span>Укажи 0 для добавления всех товаров</span>
                    <button 
                        // disabled={ ! feed }
                        className="m-3 p-2" 
                        onClick={onClickButtonAddNewProduct}
                    >
                        Добавить товары
                    </button>
                    
                    <label>или</label>
                    <button 
                        disabled={ ! feed }
                        className="m-3 p-2" 
                        onClick={onClickButtonChangePrices}
                    >
                        Обновить цены
                    </button>
                    <span>Для обавления цен не важно какая цифра указана</span>

                    <br />
                </>}

                <button 
                    className="m-3 p-2" 
                    onClick={() => props?.setBrand("")}
                >
                    назад
                </button>

            </div>
        </InfoPage>
    )


})

export default HusqvarnaParserPage;
