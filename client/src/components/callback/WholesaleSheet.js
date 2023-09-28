
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router'

import scrollUp from '../../utils/scrollUp'
import { MAIN_ROUTE, SHOP_ROUTE } from '../../utils/consts'
import Notification from '../myBootstrap/Notification'
import { Button } from '../myBootstrap'
import Loading from '../Loading'
import Phone from '../helpers/phone/Phone'
import Email from '../helpers/email/Email'
import { sendMessageL } from '../../http/mailAPI'
import { callbackForm } from '../../service/yandexMetrika/reachGoal'

import './CallBack.css'



const WholesaleSheet = (props) => { 
    
    const [ notificationVisible, setNotificationVisible ] = useState(false)

    const [ loading, setLoading ] = useState(false)
    const [ success, setSuccess ] = useState(false)
    
    const [ name, setName ] = useState("")
    const [ phone, setPhone ] = useState("")
    const [ email, setEmail ] = useState("")

    const history = useHistory()

    let className
    if (props?.className) className = props?.className


    const onClickGetWholesaleSheet = async () => {
        if ( ! name ) {
            window.alert("Необходимо ввести имя.")
        }else if ( ! phone || phone.replace(/\D/g, "").length < 10 ) {
            window.alert("Необходимо ввести номер телефона (10ть чисел).")
        }else {
            setLoading(true)

            callbackForm() // yandexMetrika

            let subject = 'Запрос оптового листа.'

            let dataEmail = ""
            
            if (email) {
                dataEmail = `<p>Почта - ${email}</p>`
            }

            let html = `
                <div>
                    <h1>Клиент запросил оптовый лист</h1>
                    <hr />                    
                    <div>
                        <p>Имя клиента - ${name}</p>
                        <p>Номер телефона - ${phone}</p>
                        ${dataEmail}
                    </div>
                </div>
                `

            let data = { 
                to_seo: true, // отправка дублирующего письма SEOшникам 
                subject,
                html
            } 

            await sendMessageL(data) // { to_seo, subject, html }

            setLoading(false)
            setSuccess(true)
        }
    } 


    return (
        <>
        <Button
            className={"CallBack "+className}
            // variant="outline-warning"
            variant="warning"
            onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setNotificationVisible(true)
            }}
        >
            Получить <span className='CallBack_SpanBr'><br /></span>оптовый прайс
        </Button>

        <Notification 
            show={notificationVisible} 
            onHide={() => {
                setSuccess(false)
                setLoading(false)
                setName("")
                setPhone("")
                setEmail("")
                setNotificationVisible(false)
                if (success) {
                    history.push(MAIN_ROUTE)
                    scrollUp(200)
                }
            }}
            time="600000" // в милисекундах
            size="lg"
            title={props.action === "Заказ оптового листа!"}
            titleMore={success ? "Успех" : loading ? "..." : "Укажите своё имя, номер телефона и почту."}
        >

            {loading ? <Loading /> 
            :
            success ? // если запрос оптового прайса отправлен
            <div
                className="CallBack_Success"
            >
                <label>Запрос успешно отправлен, ожидайте, Вам позвонят.</label>
                <br /><br />
                <Button
                    variant="outline-primary"
                    onClick={() => {
                        setSuccess(false)
                        setNotificationVisible(false)
                        history.push(MAIN_ROUTE)
                        scrollUp(200)
                    }}
                >
                    Хорошо
                </Button>
            </div>
            : // когда запрос ещё не отправлялся
            <div
                className="CallBack_Notification noselect"
            >
                
                <div
                    className="CallBack_Notification_fields"
                >
                    <table>
                        <tr>
                            <td>
                                <label>Ваше имя&nbsp;<span style={{color:"red"}}>*</span></label>&nbsp;
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    placeholder="Введите имя" 
                                    value={name} 
                                    onChange={e => {
                                        setName(e.target.value)
                                    }} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Ваш номер телефона&nbsp;<span style={{color:"red"}}>*</span></label>&nbsp;
                            </td>
                            <td>
                                <Phone phone={phone} setPhone={setPhone} placeholder="Номер телефона" withLabel={true} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Ваша почта (email)</label>&nbsp;
                            </td>
                            <td>
                                <Email email={email} setEmail={setEmail} placeholder="Введите email" withLabel={true} />
                            </td>
                        </tr>
                    </table>
                </div>


                <div
                    className="CallBack_Notification_DivButtons"
                >
                    <Button
                        variant="warning"
                        onClick={() => onClickGetWholesaleSheet() }
                    >
                        Получить оптовый прайс
                    </Button>
                    
                    <Button
                        variant="outline-primary"
                        onClick={() => setNotificationVisible(false)}
                    >
                        Продолжить покупки
                    </Button>
                </div>
            </div>
            }


        </Notification>
        </>
    )
}

export default observer(WholesaleSheet)
