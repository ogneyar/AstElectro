import React, { useContext, useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import HtmlReactParser from 'html-react-parser'

import { getOrderForUser, setTaken } from '../../http/orderAPI'
import { ADDRESS
    //, LK_ROUTE 
} from '../../utils/consts'
import Loading from '../Loading'
import { Context } from '../..'
import './OrdersInfo.css'


const OrdersInfo = () => {
        
    const { userStore } = useContext(Context) 

    // const history = useHistory()

    const [ orders, setOrders ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        if (userStore?.user?.id) {
            getOrderForUser(userStore.user.id)
                .then(data => {
                    if (data[0] !== undefined) {
                        setOrders(data.filter(i => i?.pay).reverse())
                    }
                })
                .finally(() => setLoading(false))
        }
    }, [userStore?.user])

    const onClickButtonConfirm = async (id) => {
        // setLoading(true)
        await setTaken(id)
            .then(data => {
                if (data.error === undefined) {
                    setOrders(orders.map(i => {
                        if (i.id === id) return {...i, state: "taken"}
                        return i
                    }))
                    // alert("Статус заказа изменён!")
                    // history.push(LK_ROUTE)
                    // window.open(LK_ROUTE,'_self',false)
                }
            })
            // .finally(() => setLoading(false))
    }

    if (loading) return <Loading />

    return (
        <div
            className="OrdersInfo"
        >
            {orders && Array.isArray(orders) && orders.length > 0
            ? 
                <div>
                    {orders.filter(j => j.state !== "taken").length > 0 ?
                    <div className="OrdersInfo_Title">
                        <h4>Ваши актуальные заказы:</h4>
                    </div>
                    : ""}
                    <div className="OrdersInfo_Body">
                    {orders.filter(j => j.state !== "taken").map((i,idx) => 
                            <p key={idx+"hz"}>
                                Номер:&nbsp;<strong>{i?.id}</strong> - оплачен.
                                <br />
                                Cтатус:&nbsp;
                                {(i?.state === "forming" || i?.state === "confirmed") && <strong>формируется...</strong>} 
                                {i?.state === "onway" && <strong>в пути.</strong>} 
                                {i?.state === "delivered" && 
                                <>
                                    <strong>прибыл на склад.</strong>
                                    &nbsp;
                                    <button
                                        style={{borderRadius:"5px",padding:"5px 10px"}}
                                        onClick={() => onClickButtonConfirm(i.id)}
                                    >
                                        Подтвердить получение
                                    </button>
                                </>}
                                {i?.state === "taken" && <><strong>получен.</strong><hr /></>} 
                                <br />
                                Состав заявки:&nbsp;
                                {HtmlReactParser(`${
                                    JSON.parse(i.cart).map(k => {
                                        // return k
                                        let id = k.positionId
                                        let name = k.name
                                        let article = k.itemCode
                                        let value = Number(k.quantity.value)
                                        let price = Number(k.itemPrice) / 100
                                        let amount = price * value

                                        return `<br />${id}. ${name}${article !== "0001" ? ` (${article})` : ""}:  ${value} x  ${price} р. =  ${amount} р.`

                                    })
                                }`
                                )}
                                <br />
                                {i?.state !== "taken" && 
                                <>
                                    Доставка:&nbsp;
                                        {i?.delivery === "pickup" && <strong>самовывоз</strong>}
                                        {i?.delivery === "sdek" && <strong>СДЭК</strong>}
                                        {i?.delivery === "boxberry" && <strong>Боксбери</strong>}
                                        {i?.delivery === "dl" && <strong>Деловые Линии</strong>}
                                        {i?.delivery === "pek" && <strong>ПЭК</strong>}
                                        {i?.delivery === "pochta" && <strong>Почта России</strong>}
                                    <br />
                                    Адрес склада:&nbsp;
                                        {i?.delivery === "pickup" 
                                        ? <strong>{ADDRESS}</strong> 
                                        : <strong>{i?.address}</strong>} 
                                    {i?.state !== "forming" && i?.trackNumber !== null &&
                                    <>
                                        <br />
                                        Трек номер: {i?.trackNumber}
                                    </>
                                    }
                                    <hr />
                                </>}
                            </p>
                        )}
                    </div>
                    {orders.filter(j => j.state === "taken").length > 0 ?
                    <div className="OrdersInfo_Title">
                        <h4>Ваши прошлые заказы:</h4>
                    </div>
                    : ""}
                    <div className="OrdersInfo_Body">
                        {orders.filter(j => j.state === "taken").map((i,idx) => 
                            <p key={idx+"hz2"}>
                                Номер:&nbsp;<strong>{i?.id}</strong> - оплачен.
                                <br />
                                Cтатус:&nbsp;<strong style={{color:"red"}}>получен.</strong>
                                <br />
                                Состав заявки:&nbsp;
                                {HtmlReactParser(`${
                                    JSON.parse(i.cart).map(k => {
                                        // return k
                                        let id = k.positionId
                                        let name = k.name
                                        let article = k.itemCode
                                        let value = Number(k.quantity.value)
                                        let price = Number(k.itemPrice) / 100
                                        let amount = price * value

                                        return `<br />${id}. ${name}${article !== "0001" ? ` (${article})` : ""}:  ${value} x  ${price} р. =  ${amount} р.`

                                    })
                                }`
                                )}
                                <br />
                                <div>
                                    Доставка:&nbsp;
                                        {i?.delivery === "pickup" && <strong>самовывоз</strong>}
                                        {i?.delivery === "sdek" && <strong>СДЭК</strong>}
                                        {i?.delivery === "boxberry" && <strong>Боксбери</strong>}
                                        {i?.delivery === "dl" && <strong>Деловые Линии</strong>}
                                        {i?.delivery === "pek" && <strong>ПЭК</strong>}
                                        {i?.delivery === "pochta" && <strong>Почта России</strong>}
                                    <br />
                                    Адрес склада:&nbsp;
                                        {i?.delivery === "pickup" 
                                        ? <strong>{ADDRESS}</strong> 
                                        : <strong>{i?.address}</strong>}
                                    <hr />
                                </div>
                            </p>
                        )}
                    </div>
                </div>
            :
                <div>У Вас ещё нет заказов...</div>
            }
        </div>
    )
}

export default observer(OrdersInfo)
