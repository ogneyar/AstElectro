
import React, { useEffect, useContext, useState } from 'react'
import { useQueryParam, StringParam } from 'use-query-params'
import { Container } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

import ProductList from '../../components/product/ProductList'
import Filter from '../../components/filter/Filter'
import Loading from '../../components/Loading'
import { Alert } from '../../components/myBootstrap'
import { searchValue } from '../../http/searchAPI'

import { Context } from '../..'
import './SearchPage.css'


const SearchPage = observer(() => {

    const history = useHistory()

    const { productStore } = useContext(Context)
    
    const [ loadingProduct, setLoadingProduct ] = useState(true)
    
    const [ value ] = useQueryParam('value', StringParam)

    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }    

    useEffect(() => {
        if (productStore) productStore.setPage(1)
    // eslint-disable-next-line
    },[])

    useEffect(() => { 
        if (value) {
            setLoadingProduct(true)
            searchValue({ value, limit: productStore.limit, page: productStore.page }).then(
                data => {
                    productStore.setProducts(data.rows)
                    productStore.setTotalCount(data.count)
                    setLoadingProduct(false)
                },
                error => getError(`Не удалось загрузить товары!`, error)
            ).catch(error => getError(`Не удалось загрузить данные о товарах!`, error))
        }
        // eslint-disable-next-line
    },[ value, productStore.page, productStore.limit ])


    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />


    return (
        <Container
            className="SearchPage Mobile"
        >
            <h2>Страница поиска</h2>
            <div className="SearchRow">
                <div className="SearchColCategory">
                    <button
                        onClick={() => history.push("shop")}
                    >
                        Назад в магазин
                    </button>
                </div>
                <div className="SearchColContent">
                    <Filter />
                    {loadingProduct ? <Loading />
                    : <>
                        <h3>Поиск - {value}</h3>
                        
                        <h5>Товары, соответствующие критериям поиска</h5>

                        <ProductList search />
                    </>}
                    
                </div>
            </div>
        </Container>
    )
})

export default SearchPage;
