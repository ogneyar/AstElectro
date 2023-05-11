
import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

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


    if (props?.loading) return <Loading variant="warning" />
    if (info === null) return <Loading variant="success" />


    return (
        <>

            <div className='ProductList'>

                {info && Array.isArray(info) && info[0] !== undefined
                ?
                    info.map(product => {
                        return (
                            <div></div>
                        )
                    })
                :
                    <div className="ProductList_noProducts">
                        {props?.search ? <p>Поиск не дал результатов.</p> : <p>Таких товаров ещё нет...</p>}
                    </div>
                }
                
            </div>
            
        </>
    )
})

export default ProductList
