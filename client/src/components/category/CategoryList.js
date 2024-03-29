//
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import parseHTML from 'html-react-parser'
import { Image } from 'react-bootstrap'

import CategoryItem from './CategoryItem'
import Loading from '../Loading'
import { Button } from '../myBootstrap'
import { getCategoryInfoById } from '../../http/categoryInfoAPI'
import { API_URL } from '../../utils/consts'
import { getProducts } from '../../http/productAPI'
import scrollUp from '../../utils/scrollUp'
import RequestPrice from '../cart/RequestPrice'

import advantageSvg1 from '../../assets/advantagesSvg/1_postavka.svg'
import advantageSvg2 from '../../assets/advantagesSvg/2_diler.svg'
import advantageSvg3 from '../../assets/advantagesSvg/3_best-price.svg'
import advantageSvg4 from '../../assets/advantagesSvg/4_skidki.svg'
import advantageSvg5 from '../../assets/advantagesSvg/5_dostavka.svg'
import advantageSvg6 from '../../assets/advantagesSvg/6_5let.svg'
import advantageSvg7 from '../../assets/advantagesSvg/7_postoplata.svg'

import { Context } from '../..'
import './Category.css'


const CategoryList = observer((props) => {

    const history = useHistory()

    // name - имя категории
    let { name } = useParams()

    const { categoryStore } = useContext(Context)

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

    const [image, setImage] = useState(undefined)
    
    useEffect(() => {
        if ( isProducts ) {
            // получение информации о категории
            getCategoryInfoById(isProducts.categoryInfoId)
            .then(data => {
                let img = data.image ? JSON.parse(data.image) : null
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
            })
        }
    }, [ isProducts ])

    
    useEffect(() => {
        if ( ! props?.loading && categoryStore.categories.length  ) { // если уже подгружены категории
            if (name) {
                // alert(name)
                setInfo(categoryStore.categories.filter(item => {
                    if (item.id === props.id && item.is_product) setIsProducts(item)
                    if (item.sub_category_id !== props.id || item.id === 1) return false
                    return true
                }))
            }else {
                setInfo(categoryStore.categories.filter(item => 
                    item.name === "Термоусаживаемые кабельные муфты и аксессуары"
                    ||
                    item.name === "Наконечники, гильзы и соединители"
                    ||
                    item.name === "Металлорукав и изделия из него"
                ))
            }
        }        
    }, [  props?.loading, categoryStore.categories, history.location.pathname, props?.id ])


    if (props?.loading) return <Loading variant="warning" text="categoryList_props" />
    if (info === null) return <Loading variant="success" text="categoryList_info" />
    if (isProducts !== null && categoryInfo === null && !isProducts.name.includes("ZKabel")) {
        return <Loading variant="primary" text="categoryList_products" />
    }


    return (
        <>
        
            {/* {categoryInfo && categoryInfo.title
            ? <h2>{categoryInfo.title}</h2>
            : "null"
            } */}
            
            {(! name || name === "shop") && <h2>Популярные товары:</h2>}

            <div className='CategoryList'>

                {info && Array.isArray(info) && info[0] !== undefined
                ?
                    info.map(category => {
                        return (
                            <CategoryItem 
                                key={category.id} 
                                category={category}
                            />
                        )
                    })
                :
                    isProducts !== null
                    ?
                    <div className="CategoryList_main">
                        {categoryInfo && 
                        <div className="CategoryList_main_table">
                            <h2>{categoryInfo.title}</h2>
                            <h4>Технические характеристики</h4>
                            <div className="CategoryList_main_table_div">
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
                                <br />
                                <Button
                                    variant="warning"
                                    className="CategoryList_main_table_div_btn"
                                    onClick={() => {
                                        document.getElementById('table_products').scrollIntoView();
                                    }}
                                >
                                    Заказать товар
                                </Button>
                            </div>
                        </div>}

                        <div className="CategoryList_main_images">
                            
                            {image && <div 
                                className="CategoryList_main_images_big"
                                style={{background:`url(${image}) 50% 50% / ${widthHeight} auto no-repeat`,width:widthHeight,height:widthHeight}} 
                            />}

                            <div className="CategoryList_main_images_small">
                                {categoryInfo && categoryInfo.image && categoryInfo.image.files.map((item,idx) => {
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
                        <table id="table_products" className="CategoryList_products">
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

                                            (inf.name !== "Общая длина L, мм") &&
                                            
                                            ( ! inf.name.includes("Количество") ) &&
                                            
                                            ( ! inf.name.includes("Размер") ) &&
                                            ( ! inf.name.includes("Диаметр") ) &&
                                            ( ! inf.name.includes("диаметр") ) &&
                                            ( ! inf.name.includes("Сечение") ) &&

                                            (inf.name !== "Назначение") &&

                                            (inf.name !== "Габариты, мм") &&

                                            ( ! inf.name.includes("Условный проход") ) &&
                                            ( ! inf.name.includes("Наружный диаметр") ) &&
                                            
                                            (inf.name !== "Условный размер трубы мм") &&
                                            (inf.name !== "Совместимый вводной патрубок") &&
                                            
                                            ( ! inf.name.includes("Диапазон") ) &&
                                            ( ! inf.name.includes("Минимальный внутренний диаметр") ) &&
                                            ( ! inf.name.includes("Установочная длина") ) &&
                                            ( ! inf.name.includes("Длина") ) &&

                                            ( ! inf.name.includes("Максимальный внутренний диаметр") ) &&
                                            ( ! inf.name.includes("Тип и размер установочной резьбы") ) &&

                                            ( ! inf.name.includes("Номинальное сечение") ) &&

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
                                    })
                                    .filter((data,idx) => {
                                        if (idx < 7) return true
                                        if (window.innerWidth > 991) return true
                                        return false
                                    })
                                    }
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
                                            
                                            (inf.name !== "Общая длина L, мм") &&

                                            ( ! inf.name.includes("Количество") ) &&

                                            ( ! inf.name.includes("Размер") ) &&
                                            ( ! inf.name.includes("Диаметр") ) &&
                                            ( ! inf.name.includes("диаметр") ) &&
                                            ( ! inf.name.includes("Сечение") ) &&

                                            (inf.name !== "Назначение") &&

                                            (inf.name !== "Габариты, мм") &&
                                            
                                            ( ! inf.name.includes("Условный проход") ) &&
                                            ( ! inf.name.includes("Наружный диаметр") ) &&

                                            (inf.name !== "Условный размер трубы мм") &&
                                            (inf.name !== "Совместимый вводной патрубок") &&

                                            ( ! inf.name.includes("Диапазон") ) &&
                                            ( ! inf.name.includes("Минимальный внутренний диаметр") ) &&
                                            ( ! inf.name.includes("Установочная длина") ) &&
                                            ( ! inf.name.includes("Длина") ) &&

                                            ( ! inf.name.includes("Максимальный внутренний диаметр") ) &&
                                            ( ! inf.name.includes("Тип и размер установочной резьбы") ) &&

                                            ( ! inf.name.includes("Номинальное сечение") ) &&
                                            
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
                                                {inf.name === "Артикул"
                                                ? 
                                                <>
                                                    <span 
                                                        onClick={() => { 
                                                            {/* SEOшники попросили убрать; #рукалицо */}
                                                            // history.push("/nzeta/"+product.url+"/"); scrollUp()
                                                        }} 
                                                        style={{color: "green", cursor: "pointer"}}
                                                    >
                                                        
                                                    {/* SEOшники попросили добавить ; #рукалицо */}
                                                    <a href={"/nzeta/"+product.url+"/"}>
                                                        {inf.value}
                                                    </a>

                                                    </span>
                                                    <RequestPrice
                                                        product={product}
                                                        action="Заказ"
                                                        variant="warning"
                                                        className="CategoryList_RequestPrice"
                                                    >
                                                        Заказать
                                                    </RequestPrice>
                                                </>
                                                :
                                                    inf.name === "Тип изделия"
                                                    ?
                                                        <span onClick={() => { history.push("/nzeta/"+product.url+"/"); scrollUp()}} style={{color: "green", cursor: "pointer"}}>
                                                            {inf.value}
                                                        </span>
                                                    :
                                                        inf.value.replace("&quot;",'"')
                                                }
                                            </td>
                                        )
                                    })
                                    .filter((data,idx) => {
                                        if (idx < 7) return true
                                        if (window.innerWidth > 991) return true
                                        return false
                                    })
                                    }
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        }

                        <br />

                        {categoryInfo && parseHTML(categoryInfo.description)}
                        <br />
                    </div>
                    :

                        <div className="CategoryList_noProducts">
                            {props?.search ? <p>Поиск не дал результатов.</p> : <p>Таких товаров ещё нет...</p>}
                        </div>

                }
                

            </div>

            
            {(! name || name === "shop") && 
            <>
            <h2>Наши преимущества:</h2>
            <div className="CategoryList_UTP"> 
                <div>
                    <Image className="CategoryList_UTP_advantageSvg" src={advantageSvg1} width="40" />
                    <br />
                    &nbsp;Комплексный поставщик электротехнической продукции
                </div>
                <div>
                    <Image className="CategoryList_UTP_advantageSvg" src={advantageSvg2} width="40" />
                    <br />
                    &nbsp;Официальный дилер ООО Зета
                </div>
                <div>
                    <Image className="CategoryList_UTP_advantageSvg" src={advantageSvg3} width="40" />
                    <br />
                    &nbsp;Конкурентные цены
                </div>
                <div>
                    <Image className="CategoryList_UTP_advantageSvg" src={advantageSvg4} width="40" />
                    <br />
                    &nbsp;Гибкая система скидок
                </div>
                <div>
                    <Image className="CategoryList_UTP_advantageSvg" src={advantageSvg5} width="40" />
                    <br />
                    &nbsp;Осуществляем доставку
                </div>
                <div>
                    <Image className="CategoryList_UTP_advantageSvg" src={advantageSvg6} width="40" />
                    <br />
                    &nbsp;На рынке электротехнической продукции более 5 лет
                </div>
                <div>
                    <Image className="CategoryList_UTP_advantageSvg" src={advantageSvg7} width="40" />
                    <br />
                    &nbsp;Возможна постоплата постоянным клиентам
                </div>
            </div>
            </>}
            
        </>
    )
})

export default CategoryList
