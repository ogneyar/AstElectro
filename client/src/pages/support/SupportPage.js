import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import $ from 'jquery'

import { Alert } from '../../components/myBootstrap'
import InfoPage from '../info/InfoPage'
import Loading from '../../components/Loading'
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SUPPORT_ROUTE } from '../../utils/consts'
import { Context } from '../..'

import './SupportPage.css'
import { sendMessage } from '../../http/telegramAPI'


const SupportPage = observer(() => {
    
    const { userStore } = useContext(Context)

    const [ info, setInfo ] = useState({})
    const [ value, setValue ] = useState("")
    const [ loading, setLoading ] = useState(true)
    const [ showAlert, setShowAlert ] = useState(false)

    useEffect(() => {
        if (userStore.user?.id) {
            setInfo(userStore.user)
        }
        setLoading(false)
    },[userStore.user])

    const onClickButtonSend = () => {
        if (value) {
            setLoading(true)
            // прокрутка страницы вверх
            $('html, body').animate({scrollTop: 0}, 700, function(){})

            sendMessage(`Обращение в тех.поддержку.\n${info?.email}\n\n${value}`).then(data => {
                if (data?.ok) {
                    setLoading(false)
                    setValue("")
                    setShowAlert(true)
                } 
            }).finally(() => setLoading(false))
        }
    }

    if (loading) return <Loading />


    return (
        <InfoPage>
            <div className="SupportPage">
                <header>Тех.поддержка!</header>
                <hr />

                {!info?.name
                ?
                <div className="SupportPageBody">
                    <p>Для обращения в тех. поддержку</p>
                    <p>необходимо&nbsp;
                        <NavLink
                            className="NavLink"
                            to={LOGIN_ROUTE + "?returnUrl=" + SUPPORT_ROUTE}
                        >
                            войти
                        </NavLink>
                    </p>
                    <p>&nbsp;или&nbsp;
                        <NavLink
                            className="NavLink"
                            to={REGISTRATION_ROUTE}
                        >
                            зарегистрироваться
                        </NavLink>
                        !
                    </p>
                </div>
                :
                    info?.name && !info?.isActivated
                    ?
                        <div className="SupportPageBody">
                            <p>Для обращения в тех. поддержку</p>
                            <p>Вам необходимо подтвердить</p>
                            <p>свой почтовый ящик</p>
                            <p>{info?.email}</p>
                        </div>
                    :
                    <div className="SupportPageBody">
                        <h3>Здравствуйте {info.name}!</h3>
                        <p>Опишите свой вопрос (или предложение)</p>
                        <textarea cols="35" rows="10" value={value} onChange={e => setValue(e.target.value)} /> 
                        <br />
                        <Button disabled={value === ""} onClick={onClickButtonSend}>Отправить</Button>
                    </div>
                }
               
            </div>

            <Alert show={showAlert} onHide={() => setShowAlert(false)}>
                <p>Ваше сообщение отправлено!</p>
                <p>Ответ Вам отправим на Ваш email ({info?.email})</p>
            </Alert>

        </InfoPage>
    )
})

export default SupportPage
