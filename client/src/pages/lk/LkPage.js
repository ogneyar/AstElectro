import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { observer } from 'mobx-react-lite'
import { Button } from 'react-bootstrap'

import PersonalInfo from '../../components/lk/PersonalInfo'
import OrdersInfo from '../../components/lk/OrdersInfo'
import { LOGIN_ROUTE, LK_ROUTE } from '../../utils/consts'
import { retryMail } from '../../http/userAPI'
import Loading from '../../components/Loading'
import InfoPage from '../info/InfoPage'
import Error from '../error/ErrorPage'
import { Context } from '../..'
import './LkPage.css'


const Lk = observer(() => {

    const { userStore } = useContext(Context)

    const history = useHistory()
    
    const [ redirect, setRedirect ] = useState(false)

    const [ ordersInfo, setOrdersInfo ] = useState(false)
    const [ personalInfo, setPersonalInfo ] = useState(false)
    
    const [ second, setSecond ] = useState(null)
    const [ error, setError ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        let token = localStorage.getItem("token")
        if (!token) setRedirect(true)
    },[])

    useEffect(() => {
        let time = 1000
        for(let i = 30; i >= 0; i--) {
            setTimeout(() => {
                setSecond(i)
            },time)
            time += 1000
        }
    },[])
 
    const onClickButtonRetryMail = async () => {
        setError(null)
        setLoading(true)
        const data = await retryMail(userStore?.user?.id)
        if (data?.ok) {
            window.open(LK_ROUTE,"_self",false)
            // setError(JSON.stringify(data))
            // setLoading(false)
        }else if (data?.ok === false) {
            setError(JSON.stringify(data?.response))
            setLoading(false)
        }else if (data?.error) {
            setError(data?.error)
            setLoading(false)
        }else {
            setError(JSON.stringify(data))
            setLoading(false)
        }
    }

    if (redirect) history.push(LOGIN_ROUTE)

    if (!userStore?.user?.isActivated) {
        return (
            <InfoPage>
                <div className="Lk" style={{textAlign:"center"}}>
                    <label>{userStore?.user?.name ? userStore.user.name : "Уважаемый клиент"}, добро пожаловать в личный кабинет!</label>
                    <hr/>
                    <p>Для продолжения Вам необходимо подтвердить свой почтовый ящик <span style={{color:"green"}}>{userStore.user.email}</span>.</p>
                    <p>Вам на него отправлена ссылка для активации аккаунта.</p>
                    <p>Если письмо не пришло проверьте папку СПАМ.</p>
                    {/* <p>Если и в папке СПАМ письма нет, напишите нам в тех.поддержку.</p> */}
                    <br />

                    {error}

                    {loading 
                    ? <Loading /> 
                    :
                        <Button 
                            variant="outline-success" 
                            disabled={second !== 0}
                            onClick={onClickButtonRetryMail}
                        >
                            Отправить повторно
                        </Button>
                    }

                    {second ? <p>{second}</p> : null}
                </div>
            </InfoPage>
        )
    }

    if (userStore?.user?.name) {
        return (
            <InfoPage>
                <div className="Lk">
                    <label>{userStore?.user?.name}, добро пожаловать в личный кабинет!</label> 
                    <hr/>

                    {!ordersInfo && !personalInfo 
                    ? 
                    <div
                        className="LkCards"
                    >
                        <div
                            className="LkCards_Card" 
                            onClick={() => setOrdersInfo(true)}
                        >
                            <div>
                                Заказы
                            </div>
                        </div>
                        <div
                            className="LkCards_Card" 
                            onClick={() => setPersonalInfo(true)}
                        >
                            <div>
                                Личные данные
                            </div>
                        </div>
                    </div>
                    :
                    <div style={{textAlign: "left"}}>
                        <Button variant="outline-success" onClick={() => {setOrdersInfo(false);setPersonalInfo(false)}}>Вернуться назад</Button>
                        <hr />
                    </div>
                    }

                    {ordersInfo && <OrdersInfo back={() => setOrdersInfo(false)} />}
                    {personalInfo && <PersonalInfo back={() => setPersonalInfo(false)} />}

                </div>
            </InfoPage>
        )
    }else return <Error />
})

export default Lk
