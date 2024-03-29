
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

    const { categoryStore } = useContext(Context)

    const history = useHistory()

    const onClickSelectedCategory = (category) => {
        categoryStore.setSelectedCategory(category)
        if (props.page !== "brandPage") {
            history.push("/" + category.url + "/")
         } else {
            history.push(`${window.location.pathname}?category=${category.id}`)
         }
        scrollUp(window.innerWidth > 991 ? SCROLL_TOP : SCROLL_TOP_MOBILE)
        props?.onHide()
    }


    const onClickAllCategory = () => {
        history.push("/")
        scrollUp(window.innerWidth > 991 ? SCROLL_TOP : SCROLL_TOP_MOBILE)
    }

    return (
        <ListGroup 
            className="CategoryService"
        >
            {categoryStore.categories && Array.isArray(categoryStore.categories) && categoryStore.categories.map(item => { 
                if (item.sub_category_id === 0 && item.id !== 1)
                    return <CategoryItemService key={item.id} item={item} funcOnClick={onClickSelectedCategory} />
                return null
            })}
        </ListGroup>
    )
})

export default CategoryService
