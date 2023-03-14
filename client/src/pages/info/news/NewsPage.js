
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

import { API_URL, URL } from '../../../utils/consts'
import InfoPage from '../InfoPage'

import './NewsPage.css'


const NewsPage = () => {

    const history = useHistory()

    useEffect(() => {
        let hash = history.location.hash
        if (hash) {
            let selectorHash = document.querySelector(hash)
            if (selectorHash) selectorHash.scrollIntoView()
        }
    },[history.location.hash])

    let [ fileMitex22 ] = useState(URL === "http://localhost:3000/" ? "miniMitex2022.mp4" : "Mitex2022.mp4")

    return (
        <InfoPage>
            <div
                className="NewsPage"
            >
                <h3>Наши новости!</h3>
                <hr />
                <div id="mitex22">
                    <div>
                        <h4>Мы на выставке Mitex</h4>
                        <p>MITEX - главное отраслевое событие инструментальной индустрии!</p>
                        <p>Три ярких дня выставки прошли на одном дыхании! Переговоры, конкурсы, призы, подиум, презентации новинок, ароматный и вкусный кофе, на нашем стенде "ЛЕИДТОГИ" было на что посмотреть!</p>
                        <p>Спасибо всем, кто посетил нас, мы были рады каждому из вас! Смотрите небольшой отчетный ролик о том, как это было.</p>
                            <p>Всего Вам доброго ;)</p>
                    </div>
                    <video controls="controls" poster={API_URL + "video/mitex/poster.jpg"}> 
                        <source src={API_URL + "video/mitex/" + fileMitex22} />
                        Тег video не поддерживается вашим браузером. 
                        <a href={API_URL + "video/mitex/" + fileMitex22} target="_blank" rel="noreferrer">Откройте видео в отдельной вкладке</a>.
                    </video>
                </div>
            </div>
        </InfoPage>
    )
}

export default NewsPage