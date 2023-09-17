
import React, { useState, useContext, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import { Context } from '../..'

import './CategoryService.css'


const CategoryItemService = observer(({ item, funcOnClick }) => {
    
    const { categoryStore } = useContext(Context)
    

    const [ open, setOpen ] = useState(false)

    useEffect(() => {
        setOpen(item.open)
    },[item?.open])
    
    const onClickListItem = (action) => {        
        categoryStore.setCategories(categoryStore.categories.map(i => {
            if (i.id === item?.id) {
                if (open && action !== "only_open") {
                    setOpen(false)
                    return { ...i, open: false }
                }else {
                    setOpen(true)
                    return { ...i, open: true }
                }
            }
            if (i.sub_category_id === item?.sub_category_id && action === "only_open") return { ...i, open: false }
            if (i.sub_category_id === item?.id && action === "only_open") return { ...i, open: false }
            return i
        }))
    }
    
    return (
        <div
            className={item?.sub_category_id === 0 ? "" : "CategoryItemService"}
        >
        {/* SEOшники попросили добавить ; #рукалицо */}
        <a href={"/" + item?.url + "/"}>
            <ListGroup.Item 
                active={item?.id === categoryStore.selectedCategory.id}
                onClick={() => {
                    {/* SEOшники попросили убрать; #рукалицо */}
                    // funcOnClick(item) // функция выделяет выбранную категорию
                    // onClickListItem() // функция раскрывает и закрывает выбранную категорию
                }}
                key={item?.id}
            >
                
                {item?.is_product 
                ? item.name 
                : <div
                    className="d-flex justify-content-between"
                >
                    <div>{item?.name}</div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            onClickListItem() // функция раскрывает и закрывает выбранную категорию
                        }}
                    >
                        {item?.open 
                        ? <i className="fa fa-minus-circle" aria-hidden="true"></i> 
                        : <i className="fa fa-plus-circle" aria-hidden="true"></i>}
                    </div>
                    
                </div>}
            </ListGroup.Item>
        </a>

            <div
                className="ml-3"
            >
                {open && categoryStore.categories.map(i => {
                    if (i.sub_category_id === item.id)
                        return <CategoryItemService key={i.id} item={i} funcOnClick={funcOnClick} />
                    return null
                })}
            </div>
        </div>
    )
})

export default CategoryItemService
