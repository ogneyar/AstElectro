//
import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Image } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import temp from '../../assets/temp/1.png'
import temp2 from '../../assets/temp/2.png'
import temp3 from '../../assets/temp/3.png'
import { Card } from '../myBootstrap'
import { SCROLL_TOP_MOBILE, SCROLL_TOP } from '../../utils/consts'
import scrollUp from '../../utils/scrollUp'

import { Context } from '../..'
import './Category.css'


const CategoryItem = observer((props) => {

    const [ category, setCategory ] = useState(props?.category) 
    
    const history = useHistory()

    const { categoryStore } = useContext(Context)

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

                {category?.name === "Термоусаживаемые кабельные муфты и аксессуары" && <Image className="CategoryItem_image" src={temp} />}
                {category?.name === "Наконечники, гильзы и соединители" && <Image className="CategoryItem_image" src={temp2} />}
                {category?.name === "Металлорукав и изделия из него" && <Image className="CategoryItem_image" src={temp3} />}

                <div className="CategoryItem_body">

                    {category?.name !== "Термоусаживаемые кабельные муфты и аксессуары" && 
                        category?.name !== "Наконечники, гильзы и соединители" && 
                        category?.name !== "Металлорукав и изделия из него" && 
                            <div className="CategoryItem_body_boxTop"></div>
                    }

                    <div className="CategoryItem_name">
                        {category?.name && category?.name.length > 90
                        ?
                            <div title={category?.name}>{category?.name.slice(0, 80) + "..."}</div>
                        :
                            category.name 
                        }
                    </div> 
 
                    
                    {category?.name !== "Термоусаживаемые кабельные муфты и аксессуары" && 
                        category?.name !== "Наконечники, гильзы и соединители" && 
                        category?.name !== "Металлорукав и изделия из него" && 
                            <div className="CategoryItem_body_boxBottom"></div>
                    }

                </div>

            </Card>


        </div>
    )
})

export default CategoryItem 
