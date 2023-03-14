import React, { useEffect, useState, useContext } from 'react'
import { Form, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import { fetchPochta } from '../../http/delivery/prAPI'
// import { fetchProductSizes } from '../../http/productAPI'
import getDateTime from '../../service/delivery/getDateTime'
// import getPack from '../../service/delivery/getPack'
import getService from '../../service/delivery/getService'
import { Context } from '../..'


const DeliveryPochta = observer((props) => {

    const { userStore } = useContext(Context)

    useEffect(() => {
        if (userStore.user.address) {
            let address = userStore.user.address
            let result = address.match(/\d\d\d\d\d\d/)
            if (result.index !== -1) {
                setIndex(address.substring(result.index, result.index + 6))
            }
        }
    },[userStore?.user?.address])

    const [info, setInfo] = useState({name:"", transName:"", adName:"", payNds:"", deliveryMin:""})
    const [index, setIndex] = useState("")
    
    useEffect(() => {
    }, [])

    const onClickButton = async () => {
        let cart
        cart = localStorage.getItem('cart')
        if (cart && index.length === 6) {
            cart = JSON.parse(cart)

            let weight = 0

            cart.forEach(i => {
                weight += (Number(i.value) * Number(i.size.weight))
            })

            weight = weight * 1000
            weight = Math.ceil(weight)

            let pack = 0

            setInfo({name:"", transName:"", adName:"", payNds:"", deliveryMin:""})
            let { date, time } = getDateTime()

            let dogovor = ""
            let warning, nogabarit, sms = false
            let { service } = getService(warning, nogabarit, sms)

            let indexFrom
            indexFrom = "101000" // Москва
            // indexFrom = "390000" // Рязань
            // indexFrom = "347056" // Углекаменный
            
            const response = await fetchPochta(indexFrom, index, weight, pack, date, time, service, dogovor)

            if (response?.errors) alert(response?.errors[0]?.msg)
            else setInfo(response)
        }else if (index.length < 6) alert("Введите правильный индекс!")
    }
    

    return (
        <div className="mt-3 mb-3">
            <div>
                
                {info?.name
                ?
                    <div className="mt-3 mb-3">
                        <div>{info?.name} {info?.transName && <>({info?.transName})</>}</div>
                        {info?.payNds ? <div>Стоимость с НДС: {info?.payNds} р.</div> : null}
                        {info?.deliveryMin 
                        ? 
                            <div>Срок доставки:&nbsp;
                                {info?.deliveryMin === info?.deliveryMax 
                                ? info?.deliveryMin 
                                : 
                                    <>от {info?.deliveryMin} - {info?.deliveryMax}</>
                                } д.</div> 
                        : null}
                    </div>
                :null
                }
                <div className="d-flex flex-row align-items-center flex-wrap pb-2">
                    <label  className="mr-2">Ваш индекс: </label>
                    <Form.Control 
                        value={index}
                        style={{width:"120px"}}
                        maxLength="6"
                        type="number"
                        onChange={e => setIndex(e.target.value)}
                        className='mb-2' 
                        placeholder="Индекс" 
                    />
                    <label className="ml-2">{info?.adName}</label>
                    
                </div>
                <Button
                    onClick={onClickButton}
                >
                    Расчитать доставку
                </Button>

            </div>
        </div>
    )
})

export default DeliveryPochta