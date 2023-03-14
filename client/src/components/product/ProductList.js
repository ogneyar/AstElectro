import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import ContextMenu from '../myBootstrap/context/ContextMenu'
// import { fetchProducts } from '../../http/productAPI'
import Pagination from '../pagination/Pagination'
import ProductItem from './ProductItem'
import Loading from '../Loading'
// import { sortPriceUp, sortPriceDown, sortNameUp, sortNameDown } from '../../service/product'

import { Context } from '../..'
import './Product.css'


const ProductList = observer((props) => {

    const { productStore, brandStore, 
        // categoryStore
    } = useContext(Context)

    const [ info, setInfo ] = useState(null)
    // const [ loading, setLoading ] = useState(true)
    // const [ fetchTimeOut, setFetchTimeOut ] = useState(null)

    const [ visibleContextMenu, setVisibleContextMenu ] = useState(null)
    
    useEffect(() => {

        if ( ! props?.loading || productStore.products.length ) { // если уже подгружены товары

            // let offset = productStore.page * productStore.limit - productStore.limit // отступ
            // let limit = 0
        
            let newArray

            // ----------------------------- НАДО ПЕРЕДЕЛАТЬ!!!
            // if (brandStore.selectedBrand?.id !== undefined) {
            //     newArray = productStore.products.filter(k => {
            //         if (brandStore.selectedBrand.id > 3000 && k.brandId === 9) { // RedVerg, Concorde, Квалитет с id > 3000, 9й TMK
            //             let brandName = brandStore.selectedBrand.name.toLowerCase()
            //             if (brandName === "kvalitet") brandName = "квалитет"
            //             if (k.name.toLowerCase().includes(brandName)) {
            //                 return true
            //             }
            //         }else if (k.brandId === brandStore.selectedBrand.id) {
            //             return true
            //         }
            //         return false
            //     })
            // }else 
                newArray = productStore.products
            

// ------------- ФИЛЬТРЫ НЕ УДАЛЯЙ ДОДЕЛАЙ -----------------------------------
            // if (productStore.filter && productStore.filter.price) {
            //     newArray = newArray.filter(i => 
            //         i.price >= productStore.filter.price[0] 
            //         && i.price <= productStore.filter.price[1] 
            //         && i.request === 0
            //         && i.price !== 0
            //     )
            // }

            // if (productStore.sort === "priceUp") {
            //     newArray = sortPriceUp(newArray)
            // }else if (productStore.sort === "priceDown") {
            //     newArray = sortPriceDown(newArray)
            // }else if (productStore.sort === "nameUp") {
            //     newArray = sortNameUp(newArray)
            // }else if (productStore.sort === "nameDown") {
            //     newArray = sortNameDown(newArray)
            // }else {
            //     //
            // }

            // setInfo(newArray.filter((i,index) => {
            //     if (index + 1 > offset) {
            //         limit += 1
            //         if (limit <= productStore.limit) return true
            //     }
            //     return false
            // }))
            // productStore.setTotalCount(newArray.length)            
            // setLoading(false) 
// --------------------------------------------------------------------------
            setInfo(newArray)
        }
        
    }, [  props?.loading, productStore.products, brandStore.selectedBrand ])
    // eslint-disable-next-line
    // }, [  props?.loading, productStore.products, productStore.page, productStore.limit, brandStore.selectedBrand, categoryStore.selectedCategory, productStore.sort, productStore.filter, productStore.totalCount ])
    // }, [ productStore.page, productStore.limit, brandStore.selectedBrand, categoryStore.selectedCategory, productStore, props?.categoryUrl, props?.loading, fetchTimeOut ]) 
    

    const onClickOpenOnNewPage = () => {
        let productClick
        if (visibleContextMenu && visibleContextMenu?.product) {
            productClick = visibleContextMenu.product
            let brandName = "milwaukee" // дефолтное состояние
            brandStore.brands.forEach(i => {
                if (productClick.brandId === i.id) {
                    brandName = i.name
                }
            })
            let url = brandName.toLowerCase() + '/' + productClick.url
            window.open(url)
            setVisibleContextMenu(null)
        }
    }

    if (props?.loading) return <Loading variant="warning" />
    if (info === null) return <Loading variant="success" />


    return (
        <>
            <Pagination />

            <div className='ProductList'>

                {info && Array.isArray(info) && info[0] !== undefined
                ?
                    info.map(product => {
                        return (
                            <ProductItem 
                                key={product.id} 
                                product={product}
                                visibleContextMenu={visibleContextMenu}
                                setVisibleContextMenu={setVisibleContextMenu}
                            />
                        )
                    })
                :
                    <div className="ProductList_noProducts">
                        {props?.search ? <p>Поиск не дал результатов.</p> : <p>Таких товаров ещё нет...</p>}
                    </div>
                }
                
                <ContextMenu 
                    visible={visibleContextMenu}
                >
                    <div 
                        onClick={onClickOpenOnNewPage}
                        className="ProductList_div_OpenOnNewPage"
                    >
                        Открыть в новой вкладке
                    </div>
                </ContextMenu>

            </div>
            
            {info[0] !== undefined && <Pagination />}
            
        </>
    )
})

export default ProductList
