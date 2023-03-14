import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { SUPPORT_ROUTE } from '../../utils/consts'
import Loading from '../../components/Loading'
import InfoPage from '../info/InfoPage'
import { forgotPassword } from '../../http/userAPI'
import './ForgotPasswordPage.css'
 

const ForgotPasswordPage = observer(() => { 

    const [ loading, setLoading ] = useState(false)
    
    const [ second, setSecond ] = useState(null)
    const [ email, setEmail ] = useState("")

    const [ send, setSend ] = useState(false) // отправлено ли сообщение
    const [ noSend, setNoSend ] = useState(false) // если сообщение НЕ отправлено 
    
    const [ error, setError ] = useState(false) // 

    
    useEffect(() => {
        let time = 1000
        for(let i = 15; i >= 0; i--) {
            setTimeout(() => {
                setSecond(i)
            },time)
            time += 1000
        }
    },[])

    const onClickButtonChagePassword = async () => {
        if (email && email.includes("@") && email.includes(".")) {
            setLoading(true)
            await forgotPassword(email)
                .then(data => {
                    if (data && data.ok === true) setSend(true)
                    else {
                        setNoSend(true)
                        if (data.error !== undefined) setError(data.error)
                        else if (data.ok === false) setError(data.response)
                    }
                    setLoading(false)
                })
                .catch(error => {
                    alert(error)
                    setLoading(false)
                })
        }
    }

    if (loading) return <Loading />
    
    if (send) return (
        <InfoPage>
            <div className="ForgotPasswordPage">
                <header>Смена пароля!</header>
                <hr />

                <div className="ForgotPasswordPage_box">
                    <label>Письмо с ссылкой для замены пароля отправлено на Email: {email}</label>
                </div>
                <hr />
            </div>
        </InfoPage>
    )
    
    if (noSend) return (
        <InfoPage>
            <div className="ForgotPasswordPage">
                <header>Смена пароля!</header>
                <hr />

                <div className="ForgotPasswordPage_box">
                    <label>Ваше письмо НЕ отправлено на Email: {email}</label>
                    <br />
                    {error && 
                    <>
                        <label>{error}</label>
                        <br />
                    </>}
                    <label>Обратитесь в &nbsp;
                        <NavLink
                            className="NavLink"
                            to={SUPPORT_ROUTE}
                        >
                            тех. поддержку!
                        </NavLink>
                    </label>
                </div>
                <hr />
            </div>
        </InfoPage>
    )


    return (
        <InfoPage>
            <div className="ForgotPasswordPage">
                <header>Смена пароля!</header>
                <hr />

                <div className="ForgotPasswordPage_box">
                    <label>Введите Ваш Email:</label>
                    <input 
                        className="ForgotPasswordPage_box_input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button
                        onClick={onClickButtonChagePassword}
                        disabled={second !== 0 || ! email.includes("@") || ! email.includes(".")}
                    >
                        Отправить запрос
                    </button>
                    {second ? <p>{second}</p> : null}
                </div>
                {/* <hr /> */}
            </div>
        </InfoPage>
    )

})

export default ForgotPasswordPage;
