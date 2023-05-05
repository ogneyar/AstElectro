//
import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import parseHTML from 'html-react-parser'
import { Image } from 'react-bootstrap'

// import ContextMenu from '../myBootstrap/context/ContextMenu'
// import Pagination from '../pagination/Pagination'
import CategoryItem from './CategoryItem'
import Loading from '../Loading'

import { Context } from '../..'
import './Category.css'
import { getCategoryInfoById } from '../../http/categoryInfoAPI'
import { API_URL } from '../../utils/consts'
import { getProducts } from '../../http/productAPI'
import scrollUp from '../../utils/scrollUp'


const CategoryList = observer((props) => {

    const history = useHistory()

    const { 
        // productStore, 
        // brandStore, 
        categoryStore
    } = useContext(Context)

    const [ info, setInfo ] = useState(null)

    const [ products, setProducts ] = useState(null)
    const [ categoryInfo, setCategoryInfo] = useState(null)
    const [ isProducts, setIsProducts ] = useState(null)

    const [widthHeightInt] = useState(
        window.innerWidth > "991" 
        ? 400 
        : window.innerWidth > "768" 
            ? 500 
            : window.innerWidth > "560" 
                ? 440 
                : window.innerWidth > "470" 
                    ? 350 
                    : window.innerWidth > "420" 
                        ? 300 
                        : window.innerWidth > "360" 
                            ? 250 
                            : 200
        )
    const [widthHeight] = useState(widthHeightInt + "px")

    // const [image, setImage] = useState(API_URL + "unknown.jpg")
    const [image, setImage] = useState(undefined)
    
    useEffect(() => {
        if ( isProducts ) {
            // получение информации о категории
            getCategoryInfoById(isProducts.categoryInfoId)
            .then(data => {
                let img = data.image ? JSON.parse(data.image) : null
                // console.log("categoryInfo.image.path: ", data)
                // if (img) img = {
                //     ...img, 
                //     path: img.path[img.path.length - 1] !== "/" 
                //     ? 
                //         img.path = img.path + "/" 
                //     :
                //         img.path
                // }
                let response = {
                    ...data, 
                    characteristics: JSON.parse(data.characteristics),
                    image: img
                }
                setCategoryInfo(response)
                if (img) setImage(API_URL + img.path + img.files[0])
            })
            // получение информации о товаах в этой категории
            getProducts({categoryId: props.id})
            .then(data => {
                setProducts(data)
                // console.log(data);
            })
        }
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
    if (isProducts !== null && categoryInfo === null) return <Loading variant="primary" text="categoryList_products" />


    return (
        <>
        
            {categoryInfo && 
                <h2>{categoryInfo.title}</h2>
            }

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
                    isProducts !== null //&& products !== null
                    ?
                    <div className="CategoryList_main">
                        <div className="CategoryList_main_table">
                            <h4>Технические характеристики</h4>
                            <table>
                            <tbody className="CategoryList_main_table_body">
                                {categoryInfo.characteristics.map((item,idx) => {
                                    return (
                                        <tr key={idx + "blablabla"}>
                                            <td className="CategoryList_main_table_body_name">
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.value}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            </table>
                        </div>

                        <div className="CategoryList_main_images">
                            
                            {image && <div 
                                className="CategoryList_main_images_big"
                                style={{background:`url(${image}) 50% 50% / ${widthHeight} auto no-repeat`,width:widthHeight,height:widthHeight}} 
                                // onMouseOver={(e) => {
                                //     if (propotionX > 0 && propotionY > 0) e.target.style.cursor = "zoom-in"
                                //     else e.target.style.cursor = "default"
                                // }}
                                // onMouseMove={e => {
                                //     if (propotionX > 0 && propotionY > 0) {
                                //         e.target.style.background = `url(${image}) -${(e.pageX - e.target.offsetLeft)*propotionX}px -${(e.pageY - e.target.offsetTop)*propotionY}px no-repeat`
                                //     }
                                // }}
                                // onMouseLeave={(e) => {
                                //     e.target.style.background = `url(${image}) 50% 50% / ${widthHeight} auto no-repeat`
                                // }}
                            />}

                            <div className="CategoryList_main_images_small">
                                {/* {console.log("categoryInfo.image.path: ", categoryInfo.image)} */}
                                {categoryInfo && categoryInfo.image && categoryInfo.image.files.map((item,idx) => {
                                    // if (idx === 0 && image === API_URL + "unknown.jpg") setImage(API_URL + categoryInfo.image.path + item)
                                    return (
                                        <Image 
                                            key={idx + "blablobla"}
                                            className="CategoryList_main_images_small_item"
                                            width={80} 
                                            onClick={(e) => {
                                                setImage(API_URL + categoryInfo.image.path + item)
                                            }}
                                            src={API_URL + categoryInfo.image.path + item} 
                                        />
                                    )
                                })}
                            </div>

                        </div>

                        {products && 
                        <table className="CategoryList_products">
                            <thead>                                
                                <tr className="CategoryList_products_infoName">
                                    {JSON.parse(products[0].info[0].body).map((inf,indx) => {
                                        let del = 1
                                         if (
                                            del &&
                                            (inf.name !== "Артикул") &&
                                            (inf.name !== "Тип изделия") &&
                                            (inf.name !== "Толщина стенки после усадки Т,мм") &&
                                            (inf.name !== "I, после усадки, мм") &&

                                            (inf.name !== "Комплект заземления") &&
                                            (inf.name !== "Наличие защитного слоя в кабеле") &&
                                            // (inf.name !== "Длина разделки") &&

                                            // (inf.name !== "Диапазон наружного диаметра D1, мм") &&
                                            (inf.name !== "Общая длина L, мм") &&

                                            // (inf.name !== "Количество наконечников") &&
                                            
                                            ( ! inf.name.includes("Количество") ) &&
                                            
                                            ( ! inf.name.includes("Размер") ) &&
                                            ( ! inf.name.includes("Диаметр") ) &&
                                            ( ! inf.name.includes("диаметр") ) &&
                                            ( ! inf.name.includes("Сечение") ) &&

                                            (inf.name !== "Назначение") &&

                                            (inf.name !== "Габариты, мм") &&

                                            ( ! inf.name.includes("Условный проход") ) &&
                                            ( ! inf.name.includes("Наружный диаметр") ) &&
                                            // ( ! inf.name.includes("Вн. диаметр") ) &&
                                            
                                            (inf.name !== "Условный размер трубы мм") &&
                                            // (inf.name !== "Диапазон наружного диаметра трубы, D мм") &&
                                            (inf.name !== "Совместимый вводной патрубок") &&
                                            
                                            // ( ! inf.name.includes("Диапазон внешнего диаметра") ) &&
                                            ( ! inf.name.includes("Диапазон") ) &&
                                            ( ! inf.name.includes("Минимальный внутренний диаметр") ) &&
                                            ( ! inf.name.includes("Установочная длина") ) &&
                                            ( ! inf.name.includes("Длина") ) &&

                                            ( ! inf.name.includes("Максимальный внутренний диаметр") ) &&
                                            ( ! inf.name.includes("Тип и размер установочной резьбы") ) &&

                                            ( ! inf.name.includes("Номинальное сечение") ) &&

                                            // ( ! inf.name.includes("Мин. радиус изгиба") ) &&
                                            ( ! inf.name.includes("Муфта") ) &&
                                            ( ! inf.name.includes("Шланг электромонтажный") ) &&

                                            ( ! inf.name.includes("Тип вводов") ) &&
                                            ( ! inf.name.includes("Ввод") ) &&
                                            ( ! inf.name.includes("Заглушка") ) &&

                                            ( ! inf.name.includes("Трубная резьба") ) &&
                                            ( ! inf.name.includes("Тип и размер резьбы") ) &&
                                            ( ! inf.name.includes("Высота") ) &&

                                            (inf.name)
                                         ) return null
                                        return (
                                            <th key={indx + "bloblobla"} className="CategoryList_products_infoName_item">
                                                {                                                    
                                                inf.name.includes("Размер") && (inf.name.length === 8 || inf.name.length === 9)
                                                    ? 
                                                        inf.name.replace("Размер ",'')
                                                    :
                                                        inf.name
                                                }
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                            {products.map((product,idx) => {
                                return (
                                    <tr className="CategoryList_products_infoValue" key={idx + "bloblabla"}>
                                    {JSON.parse(product.info[0].body).map((inf,indx) => {
                                        let del = 1
                                        if (
                                            del &&
                                            (inf.name !== "Артикул") &&
                                            (inf.name !== "Тип изделия") &&
                                            (inf.name !== "Толщина стенки после усадки Т,мм") &&
                                            (inf.name !== "I, после усадки, мм") &&
                                            
                                            (inf.name !== "Комплект заземления") &&
                                            (inf.name !== "Наличие защитного слоя в кабеле") &&
                                            // (inf.name !== "Длина разделки") &&
                                            
                                            // (inf.name !== "Диапазон наружного диаметра D1, мм") &&
                                            (inf.name !== "Общая длина L, мм") &&

                                            // (inf.name !== "Количество наконечников") &&

                                            ( ! inf.name.includes("Количество") ) &&

                                            ( ! inf.name.includes("Размер") ) &&
                                            ( ! inf.name.includes("Диаметр") ) &&
                                            ( ! inf.name.includes("диаметр") ) &&
                                            ( ! inf.name.includes("Сечение") ) &&

                                            (inf.name !== "Назначение") &&

                                            (inf.name !== "Габариты, мм") &&
                                            
                                            ( ! inf.name.includes("Условный проход") ) &&
                                            ( ! inf.name.includes("Наружный диаметр") ) &&
                                            // ( ! inf.name.includes("Вн. диаметр") ) &&

                                            (inf.name !== "Условный размер трубы мм") &&
                                            // (inf.name !== "Диапазон наружного диаметра трубы, D мм") &&
                                            (inf.name !== "Совместимый вводной патрубок") &&

                                            // ( ! inf.name.includes("Диапазон внешнего диаметра") ) &&
                                            ( ! inf.name.includes("Диапазон") ) &&
                                            ( ! inf.name.includes("Минимальный внутренний диаметр") ) &&
                                            ( ! inf.name.includes("Установочная длина") ) &&
                                            ( ! inf.name.includes("Длина") ) &&

                                            ( ! inf.name.includes("Максимальный внутренний диаметр") ) &&
                                            ( ! inf.name.includes("Тип и размер установочной резьбы") ) &&

                                            ( ! inf.name.includes("Номинальное сечение") ) &&
                                            
                                            // ( ! inf.name.includes("Мин. радиус изгиба") ) &&
                                            ( ! inf.name.includes("Муфта") ) &&
                                            ( ! inf.name.includes("Шланг электромонтажный") ) &&
                                            
                                            ( ! inf.name.includes("Тип вводов") ) &&
                                            ( ! inf.name.includes("Ввод") ) &&
                                            ( ! inf.name.includes("Заглушка") ) &&

                                            ( ! inf.name.includes("Трубная резьба") ) &&
                                            ( ! inf.name.includes("Тип и размер резьбы") ) &&
                                            ( ! inf.name.includes("Высота") ) &&

                                            (inf.name)
                                         ) return null
                                        return (
                                            <td key={indx + "blobloblo"} className="CategoryList_products_infoValue_item">
                                                {inf.name === "Артикул" || inf.name === "Тип изделия" 
                                                ? 
                                                <span onClick={() => { history.push("nzeta/"+product.url); scrollUp()}} style={{color: "green", cursor: "pointer"}}>
                                                    {inf.value}
                                                </span>
                                                :
                                                    inf.value.replace("&quot;",'"')
                                                }
                                            </td>
                                        )
                                    })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        }

                        <br />

                        {parseHTML(categoryInfo.description)}
                        <br />
                    </div>
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