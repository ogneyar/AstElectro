
import { useState, useEffect } from 'react' 
import { useQueryParam, StringParam, NumberParam } from 'use-query-params'
import Loading from '../../components/Loading'
import { getAllProducts, getProduct } from '../../http/parser/parseNzetaRuAPI'
const parse = require('html-react-parser');

import InfoWidePage from '../info/InfoWidePage'

import './UpdateProductsPage.css'


const UpdateProductsPage = () => {

    const [ token ] = useQueryParam('token', StringParam)
    const [ num ] = useQueryParam('number', NumberParam)

    if (token !== process.env.REACT_APP_TOKEN_UPDATES) return <InfoPage>У Вас нет допуска к этой странице!</InfoPage>
    
    const [ items, setItems] = useState("")
    const [ loadingItems, setLoadingItems ] = useState(true)
    const [ message, setMessage] = useState("")
    const [ number, setNumber] = useState(num || 0)


    useEffect(() => {            
        getAllProducts(token)
        .then(
            data => {
                setItems(data)
                // setLoadingItems(false)
            },
            error => alert(`Не удалось загрузить Items!`, error)
        )
        .catch(error => alert(`Не удалось загрузить Items!!`, error))
    },[])

    useEffect(() => {
        if (items !== "" && number < items.length) {
            let article = items[number].artikul
            getProduct(token, article).then(
                data => {
                    let send
                    if (data.error) send = data.error
                    else send = data                    
                    if (message) setMessage(send + "<br/><br/>" + message) 
                    else setMessage(send)
                    setNumber(number + 1)
                },
                error => alert(`Не удалось загрузить Product!`, error)
            )
            .catch(error => alert(`Не удалось загрузить Product!!`, error))
        }
        if (items !== "" && number >= items.length) setLoadingItems(false)
    },[items, number])
    

    return (
    <InfoWidePage
        className="UpdateProductsPage"
    >
        <h1>Страница добавления товаров</h1>
        <br />
        <br />
        {loadingItems && <Loading />}
        <br />
        {message && parse(message)}
    </InfoWidePage>
    )
}

export default UpdateProductsPage
