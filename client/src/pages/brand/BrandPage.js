
import React, { useEffect, useContext, useState } from 'react'
import { useParams, useLocation  } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Container } from 'react-bootstrap'

import { fetchProducts } from '../../http/productAPI'
import { fetchCategoriesForBrand } from '../../http/categoryAPI'

import ProductPage from '../product/ProductPage'
// import ShopPage from '../shop/ShopPage'

import { Alert } from '../../components/myBootstrap'
import CategoryBar from '../../components/category/CategoryBar'
import BrandBar from '../../components/brand/BrandBar'
import ProductList from '../../components/product/ProductList'
import Filter from '../../components/filter/Filter'
import Loading from '../../components/Loading'

import { Context } from '../..'
import './BrandPage.css'


const BrandPage = (props) => {
    
    const { productStore, categoryStore, brandStore } = useContext(Context)

    const { url } = useParams() // brandName/url -> url products

    const location = useLocation()
    
    // /leidtogi?chtoto=7&category=328
    const [ categoryId, setCategoryId ] = useState(undefined)
    
        
    const [ images ] = useState(document.getElementsByClassName("BrandPage_image"))
    
    const [ loadingBrand, setLoadingBrand ] = useState(true)
    const [ loadingProduct, setLoadingProduct ] = useState(true)

    const [ brandName ] = useState(window.location.pathname.replace("/", "").split("/")[0])

    const [ brandId, setBrandId ] = useState(undefined)

    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }

    useEffect(() => {
        // достаём из url - category (?chtoto=7&category=328)
        let category = location.search
            .replace("?", "")
            .split("&")
            .filter(item => item.split("=")[0] === "category")[0]
            ?.split("=")[1]
        if (category) setCategoryId(category)
    },[location.search])

    useEffect(() => {    
        if (brandStore.brands.length && brandName) {
            brandStore.brands.forEach(item => {
                if (item.name.toLowerCase() === brandName.toLowerCase()) {
                    setBrandId(item.id)
                    brandStore.setSelectedBrand(item)
                }
            })
        }
    },[ brandStore, brandName ])

    useEffect(() => {
        if (brandId && ! url) {
            setLoadingProduct(true)
            setLoadingBrand(false)
            fetchProducts({ 
                brandId, 
                categoryId,
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
                },
                error => getError(`Не удалось загрузить товары!`, error)
            )
            .catch(error => getError(`Не удалось загрузить данные о товарах!`, error))
        }
    },[ brandId, productStore, productStore.page, categoryId, url ])

    useEffect(() => {
        if (brandName && ! url) {
            categoryStore.setLoading(true)
            fetchCategoriesForBrand(brandName)
                .then(data => {
                    if (data.error) getError(`Не удалось загрузить категории!`, data.error)//alert(data.error) 
                    else {
                        // console.log(data);
                        categoryStore.setCategories(data.map(i => { return { ...i, open: true } }))
                        categoryStore.setLoading(false)
                    }
                },
                error => getError(`Не удалось загрузить категории!`, error)
            )
            .catch(error => getError(`Не удалось загрузить категории!`, error))
        }
    },[ brandName, categoryStore, url ])
    
    useEffect(() => {
        if (images && images[0] !== undefined && window.innerWidth < 576) {
            images[0].style.height = Math.round(window.innerWidth * 0.173) - 20 + "px"
        }
    },[images])
    

    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />

    
    if (url) return <ProductPage brandName={brandName} />


    return (<>
        <Container
            className="BrandPage"
        >
            <h2>Страница бренда</h2>
            <div className="BrandPageHeader">
                <div className="BrandPage_image">
                    {/* Пропорции лого бренда 7:1 */}
                    {brandName && <img src={`images/brands/${brandName}/${brandName}_logo.jpg`}  alt={`logo_${brandName}`} />}
                </div>
            </div>
            <div className="BrandPageBody">
                <div className="BrandColCategory">
                    {categoryStore.loading ? <Loading variant="warning" /> : <CategoryBar page={"brandPage"} />} 
                </div>
                <div className="BrandColContent">
                    {loadingBrand ? <Loading variant="warning" /> : <BrandBar page={"brandPage"} />}
                    <Filter />
                    <div className="BrandProductList">
                        {loadingProduct ? <Loading variant="warning" /> : <ProductList loading={loadingProduct} setLoading={setLoadingProduct} categoryUrl={false} /> }
                    </div>
                </div>
            </div>
        </Container>
    </>)
}


export default observer(BrandPage)
