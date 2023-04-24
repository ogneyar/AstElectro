
import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

// import ContextMenu from '../myBootstrap/context/ContextMenu'
// import Pagination from '../pagination/Pagination'
import CategoryItem from './CategoryItem'
import Loading from '../Loading'

import { Context } from '../..'
import './Category.css'


const CategoryList = observer((props) => {

    const { 
        // productStore, 
        // brandStore, 
        categoryStore
    } = useContext(Context)

    const [ info, setInfo ] = useState(null)

    const [ visibleContextMenu, setVisibleContextMenu ] = useState(null)
    
    useEffect(() => {
        if ( ! props?.loading || categoryStore.categories.length ) { // если уже подгружены категории
            setInfo(categoryStore.categories)
        }        
    }, [  props?.loading, categoryStore.products ])


    if (props?.loading) return <Loading variant="warning" />
    if (info === null) return <Loading variant="success" />


    return (
        <>
            {/* <Pagination /> */}

            <div className='CategoryList'>

                {info && Array.isArray(info) && info[0] !== undefined
                ?
                    info.map(category => {
                        if (category.sub_category_id || category.id === 1) return null
                        return (
                            <CategoryItem 
                                key={category.id} 
                                category={category}
                            />
                        )
                    })
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
