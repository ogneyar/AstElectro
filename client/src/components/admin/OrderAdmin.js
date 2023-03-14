import React, { useState, useEffect, useContext } from 'react'
// import { useHistory } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
// import HtmlReactParser from 'html-react-parser'

import { getAllOrders, editOrder, getOrder, editOrderCart } from '../../http/orderAPI'
// import { ADMIN_ROUTE } from '../../utils/consts'
import { URL } from '../../utils/consts'
import Loading from '../Loading'

import { Context } from '../..'
import './OrderAdmin.css'
import { Input } from '../myBootstrap'


const OrderAdmin = (props) => {

    const { userStore } = useContext(Context) 

    // const history = useHistory()

    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState("")
    const [ orders, setOrders ] = useState("")
    const [ details, setDetails ] = useState("")
    const [ editCart, setEditCart ] = useState(false)
    const [ createLink, setCreateLink ] = useState("")
    const [ quantity, setQuantity ] = useState(10)  // количество отображаемых заказов
    const [ amount, setAmount ] = useState(0)  // ИТОГО стоимость выбранного заказа
    const [ addPosition, setAddPosition ] = useState(false)
    const [ inputArticle, setInputArticle ] = useState("")
    const [ inputQuantity, setInputQuantity ] = useState("")
    const [ inputEditQuantity, setInputEditQuantity ] = useState("")
    const [ inputEditPrice, setInputEditPrice ] = useState("")
    const [ editQuantity, setEditQuantity ] = useState(null)
    const [ editPrice, setEditPrice ] = useState(null)

    useEffect(() => {
        setAllOrders()
    }, [])

    useEffect(() => {
        if (details && details.cart && typeof(details.cart) === "string") {
            let total = 0
            JSON.parse(details.cart).forEach(i => {
                if (i) total += i.quantity.value * i.itemPrice
            })
            setAmount(total/100)
        }
    }, [details])

    const setAllOrders = () => {
        getAllOrders()
            .then(data => {
                if (data.error === undefined) setOrders(data)
                else setError(data.error)
            })
            .catch(err => {
                setError(err)
            })
            .finally(() => setLoading(false))
    }

    const onClickButtonOrderEnd = async (id) => {
        let confirm = window.confirm("Вы уверены что хотите изменить статус заказа №" + id + " на ДОСТАВЛЕН?")
        if (confirm) {
            if (userStore.user.id === 1) {
            // setLoading(true)
            // forming, onway, delivered, taken
            await editOrder(id, { state: "delivered"})
                .then(data => {
                    if (data.error === undefined) {
                        setOrders(orders.map(i => {
                            if (i.id === id) return {...i, state: "delivered"}
                            return i
                        }))
                        // alert("Статус заказа изменён!")
                        // history.push(ADMIN_ROUTE)
                        // window.open(ADMIN_ROUTE,'_self',false)
                    }else setError(data.error)
                })
                .catch(err => {
                    setError(err)
                })
                // .finally(() => setLoading(false))
            }else {
                alert("У Вас не достаточно прав доступа, обратитесь к разработчику!")
            }
        }
    }

    const onClickSetPay = async (id) => {
        let confirm = window.confirm("Вы уверены что хотите изменить статус заказа №" + id + " на ОПЛАЧЕННЫЙ?")
        if (confirm) {
            if (userStore.user.id === 1) {
                await editOrder(id, { pay: 1})
                    .then(data => {
                        if (data.error === undefined) {
                            setOrders(orders.map(i => {
                                if (i.id === id) return {...i, pay: 1}
                                return i
                            }))
                        }else setError(data.error)
                    })
                    .catch(err => {
                        setError(err)
                    })
            }else {
                alert("У Вас не достаточно прав доступа, обратитесь к разработчику!")
            }
        }
    }
   
    const onClickInputWithUrl = () => {        
        let text = "Текст скопирован!"
        let copyText = document.getElementById("inputUrl")
        if (copyText.value !== text) {
            copyText.select()
            document.execCommand("copy")
            copyText.value = text
            copyText.title = ""
        }        
    }

    const onClickButtonCreateLink = async (id, state) => {
        let data
        if (state === "forming") {
            let confirm = window.confirm("Вы уверены что хотите подтвердить заказ №" + id + "?")
            if (confirm) {
                if (userStore.user.id === 1) {
                    await editOrder(id, { state: "confirmed"})
                    data = await getOrder(id)
                }else {
                    alert("У Вас не достаточно прав доступа, обратитесь к разработчику!")
                    return
                }
            }else {
                return
            }
        }else {
            data = await getOrder(id)
        }
        setCreateLink(`${URL}payment_order?uuid=${data.uuid}`)
        setEditCart(false)
    }


    const onClickButtonBack = () => {
        setEditCart(false)
        setCreateLink("")
        setAllOrders()
        setDetails("")
    }

    const onHide = () => {
        props?.onHide()
        setQuantity(10)
        setDetails("")
        setEditCart(false)
        setCreateLink("")
    }

    const onClickDeletePosition = async (id, positionId) => {
        await editOrderCart(id, {
            deletePosition: true, 
            positionId
        }).then(data => {
            setDetails(data)
            setAddPosition(false)
            setEditCart(false)
        })
    }

    const onClickButtonAddPosition = async (id) => {
        if (!addPosition) setAddPosition(true)
        else if (inputArticle) {
            // alert(inputArticle)
            let quantity = inputQuantity
            if (! quantity) quantity = 1
            
            await editOrderCart(id, {
                addPosition: true, 
                article: inputArticle, 
                quantity
            }).then(data => {
                // console.log(data);
                setDetails(data)
                setAddPosition(false)
                setEditCart(false)
                setInputArticle("")
                setInputQuantity("")
            })
        }
    }

    const onClickButtonEditQuantity = async (orderId, cart) => {
        if (!editQuantity) {
            setEditQuantity(cart.positionId)
            setInputEditQuantity(cart.quantity.value)
            setEditPrice(null)
        }else {
            await editOrderCart(orderId,{
                editQuantity: true,
                positionId: editQuantity,
                quantity: inputEditQuantity
            }).then(data => {
                // console.log(data);
                setDetails(data)
                setEditCart(false)
                setEditQuantity(null)
                setInputEditQuantity("")
            })
        }
    }

    const onClickButtonEditPrice = async (orderId, cart) => {
        if (!editPrice) {
            setEditPrice(cart.positionId)
            setInputEditPrice(cart.itemPrice)
            setEditQuantity(null)
        }else {
            await editOrderCart(orderId,{
                editPrice,
                positionId: editPrice,
                price: inputEditPrice
            }).then(data => {
                // console.log(data);
                setDetails(data)
                setEditCart(false)
                setEditPrice(null)
                setInputEditPrice("")
            })
        }
    }


    return (
        <Modal
            className="OrderAdmin"
            // closeButton
            show={props?.show}
            onHide={onHide}
            // onHide={() => null}
            // size="sm"
            // size="lg"
            width="600"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            // animation={true}
        >
            <Modal.Header 
                closeButton
            >
                <Modal.Title id="contained-modal-title-vcenter">
                    Заказы
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
            {loading ? <Loading />
            :
            error ? <div>{error}</div>
            :
            details 
            ? 
            <div
                className="OrderAdmin_details"
            >
                <strong>№</strong>&nbsp;{details.id}&nbsp;
                <br />
                <strong>Доставка:</strong>&nbsp;{details.delivery}&nbsp;
                <br />
                {details.delivery !== "pickup" && 
                <>
                    <strong>Адрес:</strong>&nbsp;{details.address}
                    <br />
                </>}
                {details.phone && 
                <>
                    <strong>Телефон:</strong>&nbsp;{details.phone}&nbsp;
                    <br />
                </>}
                {details.name && 
                <>
                    <strong>Ф.И.О.:</strong>&nbsp;{details.name}&nbsp;
                    <br />
                </>}
                {details.trackNumber ? 
                <>
                    <strong>Трек номер:</strong>&nbsp;{details.trackNumber}&nbsp;
                    <br />
                </>
                : 
                <>
                    <strong>Добавить трек номер</strong>
                    <br />
                </>
                }
                <strong>Корзина:</strong>&nbsp;
                <br />

                {editCart && <><br />--------------------------------------</>}

                {details && details.cart && typeof(details.cart) === "string" 
                && JSON.parse(details.cart).map(i => {
                    if (i === null) return null
                    return (
                    <div 
                        key={"details"+i.positionId}
                        className="OrderAdmin_details_onePosition"
                    >
                        <span>{i.positionId}) Артикул: {i.itemCode}.</span> 
                        {editCart 
                        && JSON.parse(details.cart).length > 1 
                        && (details.delivery !== "pickup" && JSON.parse(details.cart).length > 2)
                        && (details.delivery === "pickup" || i.positionId !== JSON.parse(details.cart).length) // если самовывоз или не последняя позиция (доставка)
                        &&
                            <span 
                                className="OrderAdmin_details_deletePosition" 
                                onClick={() => onClickDeletePosition(details.id, i.positionId)}
                            >X</span>
                        }
                        <br />
                        <span>Наименование: {i.name}</span> <br />
                        <span>
                            Количество:&nbsp;
                            {editQuantity === i.positionId 
                            ?
                                <Input 
                                    type="number"
                                    style={{width:"100px"}}
                                    value={inputEditQuantity}
                                    onChange={e => setInputEditQuantity(e.target.value)}
                                />
                            :
                                i.quantity.value
                            }
                            &nbsp;шт.&nbsp;
                        </span> 
                        {editCart 
                            && (details.delivery === "pickup" || i.positionId !== JSON.parse(details.cart).length) // если самовывоз или не последняя позиция (доставка)
                            && 
                            <div>
                                <Button
                                    variant={"light"}
                                    onClick={() => onClickButtonEditQuantity(details.id, i)}
                                >
                                    {editQuantity ? "Применить изменения" : "Редактировать количество"}
                                </Button>
                                <br />
                            </div>
                        }
                        
                        <span>
                            Цена:&nbsp;
                            {editPrice === i.positionId 
                            ?
                                <Input 
                                    type="number"
                                    style={{width:"100px"}}
                                    value={inputEditPrice/100}
                                    onChange={e => setInputEditPrice(Math.round(e.target.value * 100))}
                                />
                            :
                                i.itemPrice/100
                            }
                            р. 
                        </span>
                        {editCart && 
                            <div>
                                <Button
                                    variant={"outline-secondary"}
                                    onClick={() => onClickButtonEditPrice(details.id, i)}
                                >
                                    {editPrice ? "Применить изменения" : "Редактировать цену"}
                                </Button>
                            </div>
                        }
                        {!editCart && <br />}
                        <span>Стоимость (шт * цену): {i.quantity.value * i.itemPrice/100}р.</span>
                    </div>)
                })}&nbsp;

                {amount && <span>ИТОГО: {amount}р.<br /></span>}

                {/* {console.log(details.cart)} */}

                {editCart && 
                <span>
                    {addPosition && 
                        <div
                            className="OrderAdmin_details_addPosition"
                        >
                            <span>Артикул</span>
                            <Input 
                                type="text"
                                value={inputArticle}
                                onChange={e => setInputArticle(e.target.value)}
                            />
                            <span>Количество</span>
                            <Input 
                                type="number" 
                                placeholder="По умолчанию 1 штука" 
                                value={inputQuantity}
                                onChange={e => setInputQuantity(e.target.value)}
                            />
                        </div>
                    }
                    <Button
                        variant={addPosition ? "warning" :  "outline-warning"}
                        onClick={() => onClickButtonAddPosition(details.id)}
                        style={{marginTop:"10px",marginBottom:"10px"}}
                    >
                        {addPosition ? "Добавить" :  "Добавить позицию"}
                    </Button>
                    <br />
                </span>
                }

                {editCart && <>--------------------------------------<br /><br /></>}

                {/* <br /> */}
                <strong>Email:</strong>&nbsp;{details.email}
                <br />
                {details.createdAt && 
                <>
                    <strong>Дата создания заявки:</strong>&nbsp;{details.createdAt}&nbsp;
                    <br />
                </>}
                <br />

                <Button 
                    variant="outline-success"
                    // className='OrderAdmin_block_button'
                    onClick={() => setEditCart(!editCart)}
                    disabled={(details.state !== "forming" || createLink) ? true : false}
                >
                    {editCart ? "Закончить редактирование" : "Редактировать корзину"}
                </Button>

                <br /><br />

                <Button 
                    variant="outline-primary"
                    // className='OrderAdmin_block_button'
                    onClick={() => onClickButtonCreateLink(details.id, details.state)}
                    disabled={(details.state !== "forming" && details.state !== "confirmed") || details.pay || editCart || createLink ? true : false}
                >
                    Сформировать ссылку
                </Button>
                
                {createLink && 
                <div 
                    className="OrderAdmin_block_link"
                >
                    <Input 
                        className="OrderAdmin_block_link_input"
                        type="text"
                        value={createLink}
                        onChange={() => {}}
                        id="inputUrl" 
                        onClick={() => onClickInputWithUrl()}
                        title="Нажмите чтобы копировать текст в буфер" 
                        readOnly
                    />
                    <p>для анонимности покупателя добавь "&anon=1"</p>
                </div>
                }

                <br /><br />
                <Button 
                    variant="outline-dark"
                    // className='OrderAdmin_block_button'
                    onClick={() => onClickButtonBack()}
                >
                    Назад
                </Button>
            </div>
            :
            <div className='OrderAdmin_block'>
                {orders && Array.isArray(orders) && orders.map((i, idx) => {
                    if (idx < orders.length - quantity) return null
                    return (
                        <div 
                            key={i.id + i.state}
                            className='OrderAdmin_block_one'
                        >
                            <div
                                className="OrderAdmin_block_details"
                                onClick={() => setDetails(i)}
                                title="Подробное описание заказа"
                            >
                                {i.id})&nbsp;Статус:&nbsp;{i.state}&nbsp;
                            </div>
                            {/* <br /> */}
                            <div
                                className='OrderAdmin_block_body'
                            >
                                {i.pay === 1 
                                ? "Оплачен: ДА " 
                                : 
                                <div
                                    className='OrderAdmin_block_body_status_button'
                                    onClick={() => onClickSetPay(i.id)} 
                                    title="Установить статус - оплачен."
                                >
                                    Оплачен:&nbsp;<span>НЕТ</span>
                                </div>
                                }
                                &nbsp;
                                {i.state !== "taken" && i.state !== "delivered" && i.pay === 1 
                                ?
                                <button
                                    className='OrderAdmin_block_button'
                                    onClick={() => onClickButtonOrderEnd(i.id)}
                                    title="Изменить статус на 'Доставлен'"
                                >
                                    Доставлен?
                                </button>
                                : ""}
                            </div>
                            {/* <hr /> */}
                        </div>
                    )
                }).reverse()}
                <Button
                    variant="outline-success"
                    onClick={() => setQuantity(quantity + 10)} 
                >
                    Ещё
                </Button>
            </div>
            }

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default observer(OrderAdmin)
