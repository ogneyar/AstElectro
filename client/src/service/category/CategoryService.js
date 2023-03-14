
import React, { 
    useContext, 
    // useEffect 
} from 'react'
import { observer } from 'mobx-react-lite'
import { ListGroup } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import CategoryItemService from './CategoryItemService'
import scrollUp from '../../utils/scrollUp'
import { SCROLL_TOP, SCROLL_TOP_MOBILE } from '../../utils/consts'

import { Context } from '../..'
import './CategoryService.css'


const CategoryService = observer((props) => {

    const { categoryStore, productStore } = useContext(Context)
    const history = useHistory()

    // useEffect(() => {
    //     if (categoryStore.selectedCategory.id === undefined) categoryStore.setSelectedCategory({id: 0, name: "Все категории", is_product: true})
    // }, [categoryStore])

    const onClickSelectedCategory = (category) => {
        categoryStore.setSelectedCategory(category)
        if (props.page !== "brandPage") 
            history.push(category.url)
        else 
            history.push(`${window.location.pathname}?category=${category.id}`)
        if (window.innerWidth > 991) {
            scrollUp(SCROLL_TOP)
        }else {
            props?.onHide()// if (category.is_product) props?.onHide()
            scrollUp(SCROLL_TOP_MOBILE)
        }
        productStore.setPage(1)
    }


    return (
        <ListGroup 
            className="CategoryService"
        >
            {/* {(props?.page === "brandPage" || props?.page === "categoryPage") &&  */}
            <div title={(props?.page === "brandPage" || props?.page === "categoryPage") ? "Возврат на страницу товаров!" : ""} >
                <CategoryItemService item={{ id: 0, name: "Все категории", is_product: true }} funcOnClick={() => history.push("shop")}  />
            </div>
            {/* } */}
            {categoryStore.categories && Array.isArray(categoryStore.categories) && categoryStore.categories.map(item => { 
                if (item.sub_category_id === 0 && item.id !== 1)
                    return <CategoryItemService key={item.id} item={item} funcOnClick={onClickSelectedCategory} />
                return null
            })}
        </ListGroup>
    )
})

export default CategoryService