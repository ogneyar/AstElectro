
import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import ContextMenu from '../myBootstrap/context/ContextMenu'
import Pagination from '../pagination/Pagination'
import ProductItem from './ProductItem'
import Loading from '../Loading'

import { Context } from '../..'
import './Product.css'


const ProductList = observer((props) => {

    const { productStore, brandStore } = useContext(Context)

    const [ info, setInfo ] = useState(null)
    

    const [ visibleContextMenu, setVisibleContextMenu ] = useState(null)
    
    useEffect(() => {

        if ( ! props?.loading || productStore.products.length ) { // если уже подгружены товары
            setInfo(productStore.products)
        }
        
    }, [  props?.loading, productStore.products, brandStore.selectedBrand ])
    
    
    useEffect(() => {

        if ( info ) { 
            console.log(info)
        }
        
    }, [ info ])

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
            {/* <Pagination /> */}

            <div className='ProductList'>

                {info && Array.isArray(info) && info[0] !== undefined
                ?
                    // info[0].article
                    info.map(product => {
                        return (
                            <div></div>
                            // <ProductItem 
                            //     key={product.id} 
                            //     product={product}
                            //     // visibleContextMenu={visibleContextMenu}
                            //     // setVisibleContextMenu={setVisibleContextMenu}
                            // />
                        )
                    })
                :
                    <div className="ProductList_noProducts">
                        {props?.search ? <p>Поиск не дал результатов.</p> : <p>Таких товаров ещё нет...</p>}
                    </div>
                }
                
                {/* <ContextMenu 
                    visible={visibleContextMenu}
                >
                    <div 
                        onClick={onClickOpenOnNewPage}
                        className="ProductList_div_OpenOnNewPage"
                    >
                        Открыть в новой вкладке 
                    </div>
                </ContextMenu> */}

            </div>
            
            {/* {info[0] !== undefined && <Pagination />} */}
            
        </>
    )
})

export default ProductList
