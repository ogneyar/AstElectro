import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { LOGIN_ROUTE, PHONE_ONE } from '../../utils/consts'
import { changePassword } from '../../http/userAPI'
import Loading from '../../components/Loading'
import InfoPage from '../info/InfoPage'
import './ChangePasswordPage.css'
 

const ChangePasswordPage = observer(() => { 

    const { url } = useParams()

    const history = useHistory()

    const [ loading, setLoading ] = useState(false)
    
    const [ passwordOne, setPasswordOne ] = useState("")
    const [ passwordTwo, setPasswordTwo ] = useState("")
    
    const [ error, setError ] = useState("")
    
    const [ changed, setChanged ] = useState(false)

    const onClickButtonChagePassword = async () => {
        if (url) {
            if (passwordOne && passwordTwo) {
                if (passwordOne === passwordTwo) {
                    setLoading(true)
                    await changePassword(url, passwordTwo)
                        .then(data => {
                            if (data === true) setChanged(true)
                            else setError(`Не смог заменить пароль, обратитесь в тех. поддержку по тел.:${PHONE_ONE}!`)
                            setLoading(false)
                        })
                        .catch(error => {
                            alert(error)
                            setLoading(false)
                        })
                }else{
                    setError("Введённые пароли должны быть одинаковы!")
                }
            }else{
                setError("Необходимо пароль ввести два раза!")
            }
        }
        // else{
        //     setError("У Вас нет возможности сменить пароль!")
        // }
    }

    const onClickButtonLogin = () => {
        history.push(LOGIN_ROUTE)
    }

    if (loading) return <Loading />

    if (changed) return (
        <InfoPage>
            <div className="ChangePasswordPage">
                <header>Ваш пароль изменён!</header>
                <hr />

                <div className="ChangePasswordPage_box">
                    <button
                        onClick={onClickButtonLogin}
                    >
                        Войти
                    </button>

                </div>
                <hr />
            </div>
        </InfoPage>
    )
    

    return (
        <InfoPage>
            <div className="ChangePasswordPage">
                <header>Введите новый пароль!</header>
                <hr />

                <div className="ChangePasswordPage_box">
                    <input 
                        type="password" 
                        value={passwordOne}
                        onChange={e => setPasswordOne(e.target.value)}
                    />
                    <label>и повторите его...</label>
                    <input 
                        type="password" 
                        value={passwordTwo} 
                        onChange={e => setPasswordTwo(e.target.value)}
                    />
                    <br />
                    {error && 
                    <>
                        <label className="ChangePasswordPage_red">{error}</label>
                        <br />
                    </>
                    }

                    <button
                        onClick={onClickButtonChagePassword}
                    >
                        Изменить
                    </button>

                </div>
                <hr />
            </div>
        </InfoPage>
    )

})

export default ChangePasswordPage;
