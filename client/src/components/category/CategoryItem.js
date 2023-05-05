//
import React, { useState, useContext, 
    // useEffect 
} from 'react'
import { observer } from 'mobx-react-lite'
// import {  Image } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

// import star from '../../assets/star.png'
import { Card } from '../myBootstrap'
import { 
    // URL, API_URL, ERROR_ROUTE, 
    SCROLL_TOP_MOBILE, SCROLL_TOP } from '../../utils/consts'
// import ButtonBuy from '../cart/ButtonBuy'
// import RequestPrice from '../cart/RequestPrice'
// import priceFormater from '../../utils/priceFormater'
import scrollUp from '../../utils/scrollUp'

import { Context } from '../..'
import './Category.css'


const CategoryItem = observer((props) => {

    const [ category, setCategory ] = useState(props?.category) 
    
    const history = useHistory()

    const { categoryStore } = useContext(Context)

    // const { brandStore } = useContext(Context)

    // const [ price, setPrice ] = useState(null)
    // const [ oldPrice, setOldPrice ] = useState(null)

    
    // useEffect(() => { 
    //     setCategory(props?.category)
    // },[ props?.category ])

    // useEffect(() => { 
    //     if (category.img) {
    //         // на всякий случай, если вдруг забыл разпарсить строку
    //         if (typeof(category.img) === "string") setCategory({...category, img: JSON.parse(category.img)})
    //     }
    // },[ category ])
    
    // useEffect(() => {
    //     if (product.promo && JSON.parse(product.promo)?.old_price !== undefined) {
    //         setOldPrice(priceFormater(Number(JSON.parse(product.promo)?.old_price.replace(",", "."))))
    //     }
    //     setPrice(priceFormater(product.price))
    // },[product.price, product.promo])


    const onClickCategoryItem = () => {        
        categoryStore.setSelectedCategory(category)             
        categoryStore.setCategories(categoryStore.categories.map(i => {
            if (i.id === category.id) return { ...i, open: true }
            if (i.sub_category_id === category.sub_category_id) return { ...i, open: false }
            if (i.sub_category_id === category.id) return { ...i, open: false }
            return i
        }))
        history.push(category.url)
        scrollUp(window.innerWidth > 991 ? SCROLL_TOP : SCROLL_TOP_MOBILE)
        // console.log("category: ",category)
    }


    return (
        <div
            className="CategoryItem"
            onClick={() => onClickCategoryItem()}
            // onContextMenu={e => onClickContextMenu(e)}
        >
            <Card 
                className="CategoryItem_card"
            >

                {/* <Image 
                    className="CategoryItem_image" 
                    src={category.img && Array.isArray(category.img)  && category.img[0]?.big !== undefined
                        ? API_URL + category.img[0].big 
                        : API_URL + "unknown.jpg"
                    } 
                /> */}

                <div className="CategoryItem_body">

                    <div className="CategoryItem_body_boxTop"></div> 

                    <div className="CategoryItem_name">
                        {category?.name && category?.name.length > 90
                        ?
                            <div title={category?.name}>{category?.name.slice(0, 80) + "..."}</div>
                        :
                            category.name 
                        }

                        {/* <p>артикул: {category?.article}</p> */}
                        
                    </div> 
 
                    {/* <div className="CategoryItem_text">
                        
                        <div className="CategoryItem_price">
                            {category.request || price === 0
                            ? `Цена по запросу` 
                            : oldPrice
                                ? <>
                                    <span className="CategoryItem_price_redPrice">{price}&nbsp;р.</span>
                                    <span className="CategoryItem_price_oldPrice">{oldPrice}&nbsp;р.</span>
                                </>
                                : <>{price}&nbsp;р.</>}
                        </div>

                        {category.rating 
                        ? 
                            <div className="product-rating">
                                <div>{category.rating}</div>
                                <Image className="mt-1 ml-1" width={15} height={15} src={star} />
                            </div>
                        : null}

                    </div> */}
                    
                    {/* {category.request || price === 0
                    ? 
                    <RequestPrice product={product}>
                        ЗАПРОСИТЬ
                    </RequestPrice> 
                    : 
                    <ButtonBuy product={product}>
                        КУПИТЬ
                    </ButtonBuy>} */}
                    
                    <div className="CategoryItem_body_boxBottom"></div> 

                </div>

            </Card>


        </div>
    )
})

export default CategoryItem 