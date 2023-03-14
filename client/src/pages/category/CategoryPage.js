
import React, { useEffect, useContext, useState } from 'react'
import { Container } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import CategoryBar from '../../components/category/CategoryBar'
import BrandBar from '../../components/brand/BrandBar'
import ProductList from '../../components/product/ProductList'
import Filter from '../../components/filter/Filter'
import Loading from '../../components/Loading'
import { Alert } from '../../components/myBootstrap'
import { fetchAllCategories } from '../../http/categoryAPI'
import { fetchArrayProductsByCategory } from '../../http/productAPI'

import { Context } from '../..'
import './CategoryPage.css'


const CategoryPage = observer((props) => { 

    const { productStore, categoryStore, brandStore } = useContext(Context)

    const [ loadingCategory, setLoadingCategory ] = useState(true)
    const [ loadingBrand, setLoadingBrand ] = useState(true)
    const [ loadingProduct, setLoadingProduct ] = useState(true)
    
    const [ nameCategory, setNameCategory ] = useState("")

    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }
    
    useEffect(() => {
        if (brandStore.brands.length) {
            setLoadingBrand(false)
        }
    },[brandStore])
    

    useEffect(() => {
        // if (categoryStore.categories.length) {
        //     setLoadingCategory(false)
        //     setNameCategory(props.name) // от этого стейта зависит юзэффект ниже, поэтому его обновляем после загрузки категорий
        // }else 
        fetchAllCategories()
            .then(
                data => {
                    categoryStore.setCategories(data)//.map(item => {return {...item, open: false}}))
                    if (categoryStore.selectedCategory.id !== undefined) {// если есть выбраная категория
                        categoryStore.setSelectedCategory({}) // то её нужно обнулить
                    }
                    setLoadingCategory(false)
                    setNameCategory(props.name) // от этого стейта зависит юзэффект ниже, поэтому его обновляем после загрузки категорий
                },
                error => {
                    getError(`Не удалось загрузить категории!`, error)
                    categoryStore.setCategories([{}])
                }
            )
            .catch(error => getError( `Не удалось загрузить данные о категориях!`, error))
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if (categoryStore.categories.length && nameCategory) {
            setLoadingCategory(true)
            const reOpenCategory = (array, item) => { // рекурсивная функция для открытия выбраных подкаталогов
                let response = []
                array.forEach(i => {
                    if (item && item === i.id) {
                        response = [...response, i.id]
                        response = [...response, ...reOpenCategory(array, i.sub_category_id)]
                    }
                })
                return response
            }    
            let arrayCategory = []            
            let arr = categoryStore.categories.filter(i => { 
                if (i.url === nameCategory) { // если в url указан категория (напиример: /instrumenti)
                    categoryStore.setSelectedCategory(i) // то сделать её выделенной
                    arrayCategory = [...arrayCategory, i.id]
                    arrayCategory = [...arrayCategory, ...reOpenCategory(categoryStore.categories, i.sub_category_id)]
                    return true
                }
                return false
            })    
            let returnSelectedCategory = arr[0]    
            if ( ! returnSelectedCategory ) { // если категория не найдена
                window.location.href = "/error"
            }else {    
                let returnArrayCategories = categoryStore.categories.map(i => {
                    let yes = false
                    for (let item = 0; item < arrayCategory.length; item++) {
                        if (i.id === arrayCategory[item]) {
                            yes = true
                            break
                        }
                    }
                    if (yes) return { ...i, open: true } // то её надо открыть
                    return { ...i, open: false }
                })     
                categoryStore.setCategories(returnArrayCategories)                
                setLoadingCategory(false)
            }
        }
        
    // eslint-disable-next-line
    },[ nameCategory, /*categoryStore.categories, categoryStore.selectedCategory*/ ])

    
    useEffect(() => {
        if (props.name) {
            setLoadingProduct(true)
            fetchArrayProductsByCategory({ 
                category: props.name,
                limit: productStore.limit, 
                mix_all: productStore.mixAll, 
                mix_no_img: productStore.mixNoImg, 
                mix_promo: productStore.mixPromo, 
                page: productStore.page 
            })
                .then(data => {
                    productStore.setProducts(data.rows)
                    productStore.setTotalCount(data.count)
                    setLoadingProduct(false)
                }, error => getError(`Не удалось загрузить массив товаров!`, error))
                .catch(error => getError(`Не удалось загрузить массив товаров!`, error))
        }
    // eslint-disable-next-line 
    },[ props.name, productStore.page ])


    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />


    return (
        <Container
            className="CategoryPage Mobile"
        >
            <h2>Страница категории</h2>
            <div className="CategoryPage_Row">
                <div className="CategoryPage_ColCategory">
                    {loadingCategory || categoryStore.loading ? <Loading variant="warning" /> : <CategoryBar page="categoryPage" />}
                </div>
                <div className="CategoryPage_ColContent">
                    {loadingBrand ? <Loading variant="warning" /> : <BrandBar page={"categoryPage"} />}
                    <Filter />
                    <div className="CategoryPage_ProductList">
                        <ProductList loading={loadingProduct} setLoading={setLoadingProduct} categoryUrl={true} />
                    </div>                    
                </div>
            </div>
        </Container>
    )
})

export default CategoryPage
