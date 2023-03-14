import React, { useState, useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Card } from 'react-bootstrap'

import { URL, API_URL } from '../../utils/consts'
import { Container, Button } from '../../components/myBootstrap'
// eslint-disable-next-line
import Delivery from '../../components/delivery/Delivery'
// eslint-disable-next-line
import Payment from '../../components/payment/Payment'
import NullCart from './NullCart'
import Loading from '../../components/Loading'
import CreateOrder from '../../components/order/CreateOrder'
import Confirm from '../../components/myBootstrap/Confirm'
import addDataLayer from '../../service/dataLayer/add'
import removeDataLayer from '../../service/dataLayer/remove'
import { Context } from '../..'
import './CartPage.css'
import { getPrice } from '../../http/productAPI'


const Cart = () => {

    const context = useContext(Context)

    // состояние корзины
    const [state, setState] = useState([])
    // итоговая стоимость товаров
    const [amount, setAmount] = useState(0)
    // загрузка данных
    const [loading, setLoading] = useState(true)
    // показ сообщения 
    const [showConfirm, setShowConfirm] = useState(false)
    // ответ от пользователя
    const [response, setResponse] = useState(null)
    //
    const [item, setItem] = useState(null)
    
    // изменилась ли цена
    const [yes, setYes] = useState(false)
    
    const [newCart, setNewCart] = useState([])

    useEffect(() => {
        // если изменилась цена и новая корзина не пуста
        if (yes && newCart[0] !== undefined) {
            console.log("Изменилась цена на товар, поэтому он из корзины удалён!")
            setState(newCart)
            localStorage.setItem('cart', JSON.stringify(newCart))
            context.cartStore.setCart(newCart)
        }
    },[yes, newCart, context.cartStore])

    let cart

    useEffect(() => {
        // eslint-disable-next-line
        cart = localStorage.getItem('cart')
        if (cart) {
            cart = JSON.parse(cart)
            setState(cart)
            let totalValue = 0
            setNewCart([])
            cart.forEach(async i => {
                let price = i.price
                let total = i.total
                // let total = Math.round(i.total * 100) / 100
                await getPrice(i.id).then(data => {
                    // eslint-disable-next-line
                    if(price != data) {
                        price = data
                        // total = i.value * price
                        total =  Math.round((i.value * price) * 100) / 100
                        setYes(true)
                    }
                })
                totalValue += Number(total)
                setAmount(Math.round(totalValue * 100) / 100)
                setNewCart([...newCart,{...i, price, total}])
            })
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (response && response === "yes" && item) {
            let cart = localStorage.getItem('cart')
            cart = JSON.parse(cart)
            if (cart.length === 1) {
                localStorage.removeItem('cart')
                context.cartStore.setCart([])
                setState(null)
                setAmount(0)
            }else {
                let totalValue = 0
                cart = cart.filter(i => {
                    if (i.id !== item.id) {
                        totalValue += Number(i.total)
                        return true
                    }
                    return false
                })
                setState(cart)
                // setAmount(totalValue)
                setAmount(Math.round(totalValue * 100) / 100)
                localStorage.setItem('cart', JSON.stringify(cart))
                context.cartStore.setCart(cart)
            }
            removeDataLayer({
                article: item?.article,
                name: item?.name,
                price: item?.price,
                value: item?.value
            })
            setResponse(null)
            setItem(null)
        }else if (response && response === "no"){
            setResponse(null)
            setItem(null)
        }
    }, [response, item, context.cartStore])


    const editValue = (action, item) => {
        cart = localStorage.getItem('cart')
        if (cart) {
            cart = JSON.parse(cart)
            let totalValue = 0
            cart = cart.map(i => {
                if (i.id === item.id) {
                    let newValue = 0
                    if (action === "plus") newValue = Number(i.value) + 1
                    else if (action === "minus") newValue = Number(i.value) - 1
                    if (newValue === 0) newValue = 1
                    let newTotal = Math.round((newValue * Number(i.price)) * 100) / 100
                    totalValue += newTotal
                    return {...i, value: newValue, total: newTotal}
                }
                totalValue += Number(i.total)
                return i
            })
            if (action === "plus") {
                addDataLayer({
                    article: item?.article,
                    name: item?.name,
                    price: item?.price,
                    value: 1
                })
            }else if (action === "minus") {
                removeDataLayer({
                    article: item?.article,
                    name: item?.name,
                    price: item?.price,
                    value: 1
                })
            }
            setState(cart)
            // setAmount(totalValue)
            setAmount(Math.round(totalValue * 100) / 100)
            localStorage.setItem('cart', JSON.stringify(cart))
            context.cartStore.setCart(cart)
        }
    }

    const onClickButtonPlus = (item) => {
        editValue("plus",item)
    }

    const onClickButtonMinus = (item) => {
        editValue("minus",item)
    }
    
    const onClickButtonDelete = (item) => {
        // let yes = window.confirm(`Вы уверены, что хотите удалить товар из корзины?`)
        setShowConfirm(true)
        setItem(item)
        
    }

    if (loading) return <Loading />

    if (!state || !Array.isArray(state) || state[0]?.id === undefined) return <NullCart /> 

    return (
        <Container 
            className="CartPage"
        >
            <Card 
                className="CartCard"
            >
                <Card.Title className="CardTitle">
                    <h4>Корзина / Оформление товара</h4>
                </Card.Title>

                <table className="CartTable">
                    <thead>
                        <tr>
                            <th>№:</th>
                            <th>Наим. товара:</th>
                            <th className="CartHide">Фото:</th>
                            <th>Цена:</th>
                            <th>Кол-во:</th>
                            <th>Итого:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state && Array.isArray(state) && state.map((i,index) => {
                            return (
                                <tr
                                    key={i.id}
                                >
                                    <th>
                                        <div
                                            className="CartThDivRow"
                                        >
                                            {index+1}
                                        </div>
                                    </th>
                                    <th>
                                        <div
                                            className="CartThDivRow"
                                        >
                                            {i.name}
                                        </div>
                                    </th>
                                    <th className="CartHide">
                                        <div
                                            className="CartThDivRow"
                                        >
                                            <img 
                                                src={
                                                    i.img !== undefined
                                                    ? API_URL + i.img
                                                    : i.article.indexOf("tmk") === 0
                                                        ? URL + "images/brands/tmk/TMK_logo_big.jpg"
                                                        : API_URL + "unknown.jpg"
                                                } 
                                                width="50" 
                                                alt={i.name} 
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        <div
                                            className="CartThDivRow"
                                        >
                                            {i.price}&nbsp;р.
                                        </div>
                                    </th>
                                    <th>
                                        <div
                                            className="d-flex flex-column align-items-center"
                                        >
                                            <div
                                                className="CartThDivRow"
                                            >
                                                <Button
                                                    className="CartButtonValue"
                                                    onClick={() => onClickButtonMinus(i)}
                                                >
                                                    -
                                                </Button>
                                                <div
                                                    className="CartValue"
                                                >
                                                    {i.value}
                                                </div>

                                                <Button
                                                    className="CartButtonValue"
                                                    onClick={() => onClickButtonPlus(i)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <Button
                                                className="CartButtonDelete"
                                                onClick={() => onClickButtonDelete(i)}
                                                variant="danger"
                                            >
                                                Удалить
                                        </Button>
                                        </div>
                                    </th>
                                    <th>
                                        <div
                                            className="CartThDivRow"
                                        >
                                            {i.total}&nbsp;р.
                                        </div>
                                    </th>
                                </tr>
                            )
                        })}
                        <tr>
                            <th></th>
                            <th></th>
                            <th className="CartHide"></th>
                            <th></th>
                            <th>Итого:</th>
                            <th>
                                <div
                                    className="CartThDivRow"
                                >
                                    {Number(amount)}&nbsp;р.
                                </div>
                                
                            </th>
                        </tr>
                    </tbody>
                </table>
                
                {/* <Payment amount={amount} />  */}

                {/* <Delivery /> */}

                <br />
                <hr />

                <CreateOrder 
                    // amount={amount} 
                    setLoad={() => setLoading(true) } 
                /> 

            </Card>

            <Confirm 
                show={showConfirm} 
                onHide={() => setShowConfirm(false)} 
                setResponse={setResponse} 
                message={`Вы уверены, что хотите удалить товар из корзины?`}
            />

        </Container>
    )

}

export default observer(Cart)