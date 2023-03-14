
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

import { getPaymentLink } from '../../http/orderAPI'
import { URL } from '../../utils/consts'
import Loading from '../Loading'

import './Payment.css'


const Payment = (props) => {
    
    const [ loading, setLoading ] = useState(false)
    
    const onClickButtonPay = async () => {
        props?.setMessage("")
        // запустить лоадер во внешнем компоненте
        if (props?.load !== undefined) props?.setLoad(true)
        // запустить лоадер в этом компоненте
        setLoading(true)
        
        // let open = false
        getPaymentLink({uuid: props.uuid, url: URL})
            .then(
                data => {
                    if (data?.error) {
                        // бывает ошибка в таком формате
                        if (data.error?.error) props?.setMessage(data.error.error)
                        // а бывает в таком
                        else props?.setMessage(data.error)
                    }else if (data?.errorCode) {
                        // в таком виде ошибка прилетает от банка
                        props?.setMessage(data?.errorMessage)
                    }else if (data?.formUrl) {

                        window.open(URL + 'pay?redirect_url=' + data.formUrl,'_self',false)
                        // open = true

                    }else {
                        props?.setMessage("Не предвиденная ошибка! Error: " + data.toString())
                    }
                },
                error => {
                    props?.setMessage(error.message)
                })
            // .finally(() => {
                // if (!open) {
                //     // остановить лоадер во внешнем компоненте
                //     if (props?.load !== undefined) props?.setLoad(false)
                //     // остановить лоадер в этом компоненте
                //     setLoading(false)
                // }
            // })
    }

    return (
        <div className="Payment" id="Payment">
            
            {loading
            ?
                <Loading />
            :
                <Button 
                    variant={props?.variant || "danger"}
                    size="lg"
                    onClick={onClickButtonPay}
                >
                    {props?.text ? props?.text : "Оплатить картой"}
                </Button>
            }
            

        </div>
    )
}

export default Payment
