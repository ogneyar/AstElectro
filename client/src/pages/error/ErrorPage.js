import React from 'react'

import NavLink from '../../components/myBootstrap/NavLink'
import { SUPPORT_ROUTE } from '../../utils/consts'
import InfoPage from '../info/InfoPage'
import './ErrorPage.css'


const ErrorPage = () => {
    return (
        <InfoPage>

            <div
                className="ErrorPage"
            >

                <header>Произошла ошибка</header>

                <label>
                    <strong>Что-то пошло не так...</strong>
                </label>

                <label>По всем вопросам обращайтесь в <NavLink to={SUPPORT_ROUTE}>тех. поддержку.</NavLink></label>

            </div>
           
        </InfoPage>
    )
}

export default ErrorPage
