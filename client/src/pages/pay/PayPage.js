import React, { useEffect } from 'react'
import { useQueryParam, StringParam } from 'use-query-params'

import InfoPage from '../info/InfoPage'
import Loading from '../../components/Loading'
import './PayPage.css'


const PayPage = (props) => {
    
    const [ redirectUrl ] = useQueryParam('redirect_url', StringParam)
   
    useEffect(() => {
        if (redirectUrl) window.open(redirectUrl,'_self',false)
    },[redirectUrl])


    return (
        <InfoPage>
            <div className="PayPage">
                <div>
                    <p>Ожидайте...</p>
                </div>
                <div>
                    <Loading />
                </div>
            </div>
        </InfoPage>
    )
}

export default PayPage
