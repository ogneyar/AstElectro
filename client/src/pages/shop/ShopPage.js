
import React, { useEffect, useContext, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import CategoryBar from '../../components/category/CategoryBar'
import BrandBar from '../../components/brand/BrandBar'
import ProductList from '../../components/product/ProductList'
import Filter from '../../components/filter/Filter'
import Loading from '../../components/Loading'
import { Alert } from '../../components/myBootstrap'
import { fetchAllCategories } from '../../http/categoryAPI'
import { fetchProducts } from '../../http/productAPI'
import CategoryPage from '../category/CategoryPage'

import { Context } from '../..'

import './ShopPage.css'


const ShopPage = observer(() => { 

    const { productStore, categoryStore, brandStore } = useContext(Context)

    const [ loadingCategory, setLoadingCategory ] = useState(true)
    const [ loadingBrand, setLoadingBrand ] = useState(true)
    const [ loadingProduct, setLoadingProduct ] = useState(true)
    
    // name - имя категории
    let { name } = useParams()


    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }

    useEffect(() => {
        if ( ! name || name === "shop") {
            fetchAllCategories()
                .then(
                    data => {
                        categoryStore.setCategories(data)
                        setLoadingCategory(false)
                        // if (categoryStore.selectedCategory.id !== undefined) {// если есть выбраная категория
                            categoryStore.setSelectedCategory({id: 0, name: "Все категории", is_product: true}) // то её нужно обнулить
                        // }
                    },
                    error => {
                        getError(`Не удалось загрузить категории!`, error)
                        categoryStore.setCategories([{}])
                    }
                )
                .catch(error => getError( `Не удалось загрузить данные о категориях!`, error))
        }
    },[categoryStore, name])


    useEffect(() => {
        if ( ! name || name === "shop") productStore.setPage(1) 
    // eslint-disable-next-line
    },[name])


    useEffect(() => {
        if ( ! name || name === "shop") {
            setLoadingProduct(true) 
            fetchProducts({ 
                limit: productStore.limit, 
                mix_all: productStore.mixAll, 
                mix_no_img: productStore.mixNoImg, 
                mix_promo: productStore.mixPromo, 
                page: productStore.page 
            }).then(data => {
                    productStore.setProducts(data.rows) 
                    productStore.setTotalCount(data.count) 
                    setLoadingProduct(false)
                },
                error => getError(`Не удалось загрузить товары!`, error)
            ).catch(error => getError(`Не удалось загрузить данные о товарах!`, error))
        }        
    },[productStore, name, productStore.page])


    useEffect(() => {
        if ( ! name || name === "shop") brandStore.setSelectedBrand({})
        if (brandStore.brands.length) {
            setLoadingBrand(false)
        }
    },[brandStore, name])
    

    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />

    if (name && name !== "shop") return <CategoryPage name={name} />


    return (
        <Container
            className="ShopPage Mobile"
        >
            <h2>Страница товаров</h2>
            <div className="ShopRow">
                <div className="ShopColCategory">
                    {loadingCategory || categoryStore.loading ? <Loading variant="warning" /> : <CategoryBar />}
                </div>
                <div className="ShopColContent">
                    {loadingBrand ? <Loading variant="warning" /> : <BrandBar />}
                    <Filter />
                    <div className="ShopProductList">
                        <ProductList loading={loadingProduct} setLoading={setLoadingProduct} categoryUrl={false} /> 
                    </div>                    
                </div>
            </div>
        </Container>
    )
})

export default ShopPage
