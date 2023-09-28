
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router'

import scrollUp from '../../utils/scrollUp'
import { MAIN_ROUTE } from '../../utils/consts'
import Notification from '../myBootstrap/Notification'
import { Button } from '../myBootstrap'
import Loading from '../Loading'
import Phone from '../helpers/phone/Phone'
import { sendCallBackL } from '../../http/mailAPI'
import { callbackForm } from '../../service/yandexMetrika/reachGoal'

import './CallBack.css'



const CallBack = (props) => { 
    
    const [ notificationVisible, setNotificationVisible ] = useState(false)

    const [ loading, setLoading ] = useState(false)
    const [ success, setSuccess ] = useState(false)
    
    const [ name, setName ] = useState("")
    const [ phone, setPhone ] = useState("")

    const history = useHistory()

    let className
    if (props?.className) className = props?.className


    const onClickCallBack = async () => {
        if ( ! name ) {
            window.alert("Необходимо ввести имя.")
        }else if ( ! phone || phone.replace(/\D/g, "").length < 10 ) {
            window.alert("Необходимо ввести номер телефона (10ть чисел).")
        }else {
            setLoading(true)

            callbackForm() // yandexMetrika

            await sendCallBackL({
                name,
                phone
            })

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
            Заказать <span className='CallBack_SpanBr'><br /></span>обратный звонок
            {/* Получить <span className='CallBack_SpanBr'><br /></span>оптовый лист */}
        </Button>

        <Notification 
            show={notificationVisible} 
            onHide={() => {
                setSuccess(false)
                setLoading(false)
                setName("")
                setPhone("")
                setNotificationVisible(false)
                if (success) {
                    history.push(MAIN_ROUTE)
                    scrollUp(200)
                }
            }}
            time="600000" // в милисекундах
            size="lg"
            title={props.action === "Заказ обратного звонка!"}
            titleMore={success ? "Успех" : loading ? "..." : "Укажите своё имя и номер телефона."}
        >

            {loading ? <Loading /> 
            :
            success ? // если запрос звонка отправлен 
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
                    </table>
                </div>


                <div
                    className="CallBack_Notification_DivButtons"
                >
                    <Button
                        variant="warning"
                        onClick={() => onClickCallBack() }
                    >
                        Заказать звонок!
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

export default observer(CallBack)
