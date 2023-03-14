import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Form } from 'react-bootstrap'

import { SUPPORT_ROUTE } from '../../utils/consts'
import scrollUp from '../../utils/scrollUp'
// import InfoPage from '../../pages/info/InfoPage'
import { forgotPassword, updateUser } from '../../http/userAPI'
import Loading from '../Loading'
import { Context } from '../..'
import './PersonalInfo.css'


const PersonalInfo = () => {
    
    const { userStore } = useContext(Context) 

    const [ info, setInfo ] = useState({})
    const [ loading, setLoading ] = useState(true)

    const [ address, setAddress ] = useState("")
    const [ changedAddress, setChangedAddress ] = useState(false)

    const [ send, setSend ] = useState(false) // отправлено ли сообщение
    const [ noSend, setNoSend ] = useState(false) // если сообщение НЕ отправлено 
    
    const [ error, setError ] = useState(false) // если сообщение НЕ отправлено 

    useEffect(() => { 
        if (userStore.user?.id) {
            setInfo(userStore.user)
            if (userStore.user?.address) setAddress(userStore.user?.address)
            setLoading(false)
        }
    },[userStore?.user])

    const onClickButtonChangePassword = async () => {
        scrollUp()
        // history.push(CHANGE_PASSWORD_ROUTE)
        if (info && info.email !== undefined) {
            setLoading(true)
            await forgotPassword(info.email)
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

    const onClickButtonChangeAdress = () => {
        if (changedAddress && address) {
            setChangedAddress(false)
            updateUser(userStore.user?.id, { address }) 
        }else setChangedAddress(true)
    }

    if (loading) return <Loading />
    
    if (send) return (
        <div className="PersonalInfo_header">
            <label>Письмо с ссылкой для замены пароля отправлено на Email: {info.email}</label>
            <hr />
        </div>
    )
    
    if (noSend) return (
        <div className="PersonalInfo_header">
            <label>Ваше письмо не отправлено на Email: {info.email}</label>
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
            <hr />
        </div>
    )


    return (
        <div
            className="PersonalInfo"
        >
            <div className="PersonalInfo_header">Ваши личные данные.</div>

            <hr />

            <label>Фамилия: <span className="PersonalInfo_red">*</span></label>
            <div className="PersonalInfo_box">
                <Form.Control 
                    className="PersonalInfo_box_input"
                    maxLength="256"
                    placeholder="Введите фамилию"
                    disabled
                    value={info.surname}
                    onChange={e => setInfo({...info,surname:e.target.value})}
                />
            </div>

            <label>Имя: <span className="PersonalInfo_red">*</span></label>
            <div className="PersonalInfo_box">
                <Form.Control 
                    className="PersonalInfo_box_input"
                    maxLength="256"
                    placeholder="Введите имя"
                    disabled
                    value={info.name}
                    onChange={e => setInfo({...info,name:e.target.value})}
                />
            </div>

            <label>Отчество: (при наличии)</label>
            <div className="PersonalInfo_box">
                <Form.Control 
                    className="PersonalInfo_box_input"
                    maxLength="256"
                    placeholder="Введите отчество"
                    disabled
                    value={info.patronymic}
                    onChange={e => setInfo({...info,patronymic:e.target.value})}
                />
            </div>

            <label>Телефон: <span className="PersonalInfo_red">*</span></label>
            <div className="PersonalInfo_box">
                <span>+7&nbsp;</span>
                <Form.Control 
                    className="PersonalInfo_box_input"
                    maxLength="20"
                    placeholder="Введите номер телефона"
                    disabled
                    value={info.phone.toString().replace("7","")}
                    onChange={e => setInfo({...info,phone:e.target.value})}
                />
            </div>

            <label>Адрес: <span className="PersonalInfo_red">*</span></label>
            <div className="PersonalInfo_box">
                <Form.Control 
                    className="PersonalInfo_box_input"
                    maxLength="1024"
                    placeholder="Введите адрес"
                    disabled={ ! changedAddress }
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />
                <button 
                    onClick={onClickButtonChangeAdress} 
                    className="PersonalInfo_box_button"
                >
                    {changedAddress ? "Применить изменения" : "Изменить адрес"}
                </button>
            </div>

            <label>Email: <span className="PersonalInfo_red">*</span></label>
            <div className="PersonalInfo_box">
                <Form.Control 
                    className="PersonalInfo_box_input"
                    maxLength="256"
                    placeholder="Введите email"
                    disabled
                    value={info.email}
                    onChange={e => setInfo({...info,email:e.target.value})}
                />
            </div>

            <label>Пароль: <span className="PersonalInfo_red">*</span></label>
            <div className="PersonalInfo_box">
                <Form.Control 
                    className="PersonalInfo_box_input"
                    disabled
                    value={"88888888"}
                    type="password"
                />
                <button 
                    onClick={onClickButtonChangePassword} 
                    className="PersonalInfo_box_button"
                >
                    Сменить пароль
                </button>
            </div>

            {info.role === 'CORP' 
            ?
            <>
            <label>Название компании: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="256"
                placeholder="Введите название компании"
                disabled
                value={info.companyName}
                onChange={e => setInfo({...info,companyName:e.target.value})}
            />

            <label>ИНН: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="10"
                placeholder="Введите ИНН"
                disabled
                value={info.INN}
                onChange={e => setInfo({...info,INN:e.target.value})}
            />

            <label>КПП: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="9"
                placeholder="Введите КПП"
                disabled
                value={info.KPP}
                onChange={e => setInfo({...info,KPP:e.target.value})}
            />

            <label>ОГРН:</label>
            <Form.Control 
                className="mb-2"
                maxLength="15"
                placeholder="Введите ОГРН"
                disabled
                value={info.OGRN}
                onChange={e => setInfo({...info,OGRN:e.target.value})}
            />

            <label>ОКВЭД:</label>
            <Form.Control 
                className="mb-2"
                maxLength="6"
                placeholder="Введите ОКВЭД"
                disabled
                value={info.OKVED}
                onChange={e => setInfo({...info,OKVED:e.target.value})}
            />

            <label>Юр.адрес: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="1024"
                placeholder="Введите юр.адрес"
                disabled
                value={info.juridicalAddress}
                onChange={e => setInfo({...info,juridicalAddress:e.target.value})}
            />

            <label>Название банка: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="256"
                placeholder="Введите название банка"
                disabled
                value={info.bank}
                onChange={e => setInfo({...info,bank:e.target.value})}
            />

            <label>БИК: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="9"
                placeholder="Введите БИК"
                disabled
                value={info.BIK}
                onChange={e => setInfo({...info,BIK:e.target.value})}
            />

            <label>Кор.счёт: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="20"
                placeholder="Введите кор.счёт"
                disabled
                value={info.corAccount}
                onChange={e => setInfo({...info,corAccount:e.target.value})}
            />

            <label>Расчетный счет: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="20"
                placeholder="Введите расчетный счет"
                disabled
                value={info.payAccount}
                onChange={e => setInfo({...info,payAccount:e.target.value})}
            />

            <label>Должность: <span className="PersonalInfo_red">*</span></label>
            <Form.Control 
                className="mb-2"
                maxLength="256"
                placeholder="Введите должность"
                disabled
                value={info.post}
                onChange={e => setInfo({...info,post:e.target.value})}
            />
            </>
            
            : null}

            <hr />
        </div>
    )
}

export default observer(PersonalInfo)
