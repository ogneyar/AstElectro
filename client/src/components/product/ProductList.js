
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import Loading from '../Loading'
import Pagination from '../pagination/Pagination'

import { Context } from '../..'
import './Product.css'


const ProductList = observer((props) => {

    const { productStore, brandStore } = useContext(Context)

    const [ info, setInfo ] = useState(null)
    
    const history = useHistory()


    useEffect(() => {
        if ( ! props?.loading || productStore.products.length ) { // если уже подгружены товары
            setInfo(productStore.products)
        }
    }, [  props?.loading, productStore.products, brandStore.selectedBrand ])
    
    
    const onClickProducts = (product) => {
        let brandName
        brandStore.brands.forEach(i => {
            if (product.brandId === i.id) brandName = i.name.toLowerCase()
        })
        history.push(`/${brandName}/${product.url}`)
    }

    if (props?.loading) return <Loading variant="warning" />
    if (info === null) return <Loading variant="success" />


    return (
        <>

            {info[0] !== undefined && <Pagination />}

            <br />

            <div className='ProductList'>

                {info && Array.isArray(info) && info[0] !== undefined
                ?
                    info.map((product,idx) => {
                        return (
                            <div key={idx+"pr"}>
                                <div 
                                    className='ProductList_link'
                                    onClick={()=>onClickProducts(product)}
                                >
                                    {product.name}                                
                                </div>
                                <br />
                                {/* <br /> */}
                            </div>
                        )
                    })
                :
                    <div className="ProductList_noProducts">
                        {props?.search ? <p>Поиск не дал результатов.</p> : <p>Таких товаров ещё нет...</p>}
                    </div>
                }
                
            </div>

            <br />

            {info[0] !== undefined && <Pagination />}
            
        </>
    )
})

export default ProductList
