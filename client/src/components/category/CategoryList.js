
import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

// import ContextMenu from '../myBootstrap/context/ContextMenu'
// import Pagination from '../pagination/Pagination'
import CategoryItem from './CategoryItem'
import Loading from '../Loading'

import { Context } from '../..'
import './Category.css'


const CategoryList = observer((props) => {

    const history = useHistory()

    const { 
        // productStore, 
        // brandStore, 
        categoryStore
    } = useContext(Context)

    const [ info, setInfo ] = useState(null)

    const [ products, setProducts ] = useState(null)
    const [ isProducts, setIsProducts ] = useState(null)

    
    useEffect(() => {
        if ( isProducts ) {}
    }, [ isProducts ])


    // const [ visibleContextMenu, setVisibleContextMenu ] = useState(null)
    
    useEffect(() => {
        if ( ! props?.loading && categoryStore.categories.length  ) { // если уже подгружены категории
            setInfo(categoryStore.categories.filter(item => {
                if (item.id === props.id && item.is_product) setIsProducts(item)
                if (item.sub_category_id !== props.id || item.id === 1) return false
                return true
            }))
            // setInfo(categoryStore.categories)
            // alert("alert")
        }        
    }, [  props?.loading, categoryStore.categories, history.location.pathname, props?.id ])


    if (props?.loading) return <Loading variant="warning" text="categoryList_props" />
    if (info === null) return <Loading variant="success" text="categoryList_info" />
    if (isProducts !== null && products === null) return <Loading variant="primary" text="categoryList_products" />


    return (
        <>
            {/* <Pagination /> */}

            <div className='CategoryList'>

                {info && Array.isArray(info) && info[0] !== undefined
                ?
                    info.map(category => {
                        // if (category.sub_category_id !== props.id || category.id === 1) return null
                        return (
                            <CategoryItem 
                                key={category.id} 
                                category={category}
                            />
                        )
                    })
                :
                    isProducts !== null && products !== null
                    ?
                        products                     
                    :

                        <div className="CategoryList_noProducts">
                            {props?.search ? <p>Поиск не дал результатов.</p> : <p>Таких товаров ещё нет...</p>}
                        </div>

                }
                

            </div>
            
            {/* {info[0] !== undefined && <Pagination />} */}
            
        </>
    )
})

export default CategoryList
