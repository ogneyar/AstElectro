import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import Loading from '../../components/Loading'
import InfoPage from '../info/InfoPage'
import LoginPage from '../login/LoginPage'
import Error from '../error/ErrorPage'
import { activate } from '../../http/userAPI'
import { Context } from '../..'

import './ConfirmPage.css'


const ConfirmPage = observer(() => { 

    const { userStore } = useContext(Context)
    const { url } = useParams()
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        async function activateUser(id, url) {
            await activate(id, url).then(data => {
                userStore.setUser({...userStore.user, isActivated:1})
            }).finally(() => setLoading(false))
        }
        if (userStore.user?.id) {
            if (!userStore.user?.isActivated) {
                activateUser(userStore.user.id, url)
            }
        }else if (userStore?.loading === false) {
            setLoading(false)
        }
    // eslint-disable-next-line
    },[userStore.user?.id])


    if (loading) return <Loading />

    if (url) {

        if (userStore.user?.id) { 

            if (userStore.user?.isActivated ) 
            return (
                <InfoPage>
                    <div className="ConfirmPage">
                        <label>{userStore.user?.name}</label>
                        <br />
                        <label>Ваш почтовый ящик подтверждён!</label>
                        <hr />
                    </div>
                </InfoPage>
            )
            return <Error />
            
        }else return <LoginPage confirm url={url} />

        
    }else return <Error />

})

export default ConfirmPage;
