//
import React, { useEffect, useState, useContext } from 'react'
import { Card, Container, Image, Row } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import HtmlReactParser from 'html-react-parser'

import { fetchOneProduct, fetchOneProductOnUrl } from '../../http/productAPI'
import { fetchCategoryById } from '../../http/categoryAPI'
import { API_URL } from '../../utils/consts'
import Error from '../error/ErrorPage'
import Loading from '../../components/Loading'
import RequestPrice from '../../components/cart/RequestPrice'
import priceFormater from '../../utils/priceFormater'

import { Context } from '../..'
import './ProductPage.css' 


const ProductPage =  observer((props) => {
    // eslint-disable-next-line
    const { ratingStore, breadStore, brandStore } = useContext(Context)

    const { id, url } = useParams()

    const history = useHistory()

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

    const [image, setImage] = useState(API_URL + "unknown.jpg")

    const [propotionX, setPropotionX] = useState(null)
    const [propotionY, setPropotionY] = useState(null)

    const [price, setPrice] = useState(null)
    const [oldPrice, setOldPrice] = useState(null)
    
    const [product, setProduct] = useState({name: "", article: "", img: "", price: "", info: [], size: [], have: 1, request: 0})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [categoryImages, setCategoryImages] = useState(null)
    const [description, setDescription] = useState(null)
    
    const [multiplier, setMultiplier] = useState(1)

    useEffect(() => {
        if (product?.info && Array.isArray(product.info) && product.info[0] !== undefined) {
            // console.log(product.info.filter(item => item.title === "multiplier")[0].body)
            setMultiplier(product.info.filter(item => item.title === "multiplier")[0].body)
        }
    },[product?.info])

    const alertError = (err) => {
        if (typeof(err) === "string") alert(err)
        if (typeof(err) === "object") alert(JSON.stringify(err))
    }
    
    useEffect(() => {
        if (id) {
            fetchOneProduct(id)
                .then(data => {
                    if (!data?.id) {
                        window.location.href = "/error"
                    }else {
                        setProduct(data)
                        ratingStore.setRate(data.rating)
                    }
                },err => {
                    setError(true)
                    alertError(err)
                })
                .finally(() => setLoading(false))
        }
    // eslint-disable-next-line
    },[id])


    useEffect(() => {
        if (product.promo && JSON.parse(product.promo)?.old_price !== undefined) {
            setOldPrice(priceFormater(Number(JSON.parse(product.promo)?.old_price.replace(",", "."))))
        }
        setPrice(priceFormater(product.price))
    },[product.price, product.promo])


    useEffect(() => {
        if (product.img && Array.isArray(product.img) && product.img[0]?.big !== undefined) {
            setImage(API_URL + product.img[0].big)
        }else if (product.img === "in category") {
            fetchCategoryById(product.categoryId)
                .then(data => {
                    let info = data.info
                    let image = JSON.parse(info.image)
                    setCategoryImages(image)
                    setImage(API_URL + image.path + image.files[0])                    
                    if (info.description.replace(`<div class="description">`,"").replace(`</div>`,"").trim())
                        setDescription(info.description.replace(`<div class="description">`,"<div>"))
                })
        }
    },[product.img, product.brandId])
    
    useEffect(() => {
        if (image !== API_URL + "unknown.jpg") {
            const img = document.createElement('img')
            img.onload = e => {
                setPropotionX(img.width / widthHeightInt - 1)
                setPropotionY(img.height / widthHeightInt - 1)
            }
            img.src = image
        }
    },[image, widthHeightInt])
    
    useEffect(() => {
        if (url) {
            fetchOneProductOnUrl(url)
                .then(data => {
                    if (!data?.id) {
                        window.location.href = "/error"
                    }else {
                        brandStore.brands.forEach(i => {
                            if (data?.brandId === i?.id) 
                                if (i?.name.toLowerCase() !== props?.brandName) history.push("/" + props?.brandName)
                        })
                        
                        setProduct(data)

                        ratingStore.setRate(data.rating)
                    }
                },err => {
                    setError(true)
                    alertError(err)
                })
                .finally(() => setLoading(false))
        }
    // eslint-disable-next-line
    },[url])

    if (loading) return <Loading />

    if (error) {
        return <Error />
    }

    if (!loading && !error) {
        // detailDataLayer({ // Яндекс.Метрика
        //     article: product?.article,
        //     name: product?.name,
        //     price: product?.price,
        // })
    }

    let light =true

    return ( 
        <Container className="ProductPage"> 
            <div className="ProductName">
                {/* Ссылка, для того чтобы можно было правой клавишей мыши вызвать контекстное меню */}
                <a href={product.url}>
                    <h3>{product.name}</h3> 
                </a>
                <p>Артикул: {product.article}</p> 
            </div>
            <div className="ProductMainBox">
                <div md={4} className="ProductImage">

                    <div
                        className="ProductImageDiv" 
                    >
                        {categoryImages && Array.isArray(categoryImages.files)
                        ? categoryImages.files.map((item,idx) => {
                            return (
                                <Image 
                                    key={idx + "new Date()"}
                                    className="ProductImageSmall"
                                    width={80} 
                                    onClick={(e) => {
                                        setImage(API_URL + categoryImages.path + item)
                                    }}
                                    src={API_URL + categoryImages.path + item}
                                />
                            )
                        })
                        : null}
                    </div>
                    {/* Ссылка, для того чтобы можно было правой клавишей мыши вызвать контекстное меню */}
                    <a href={product.url}>
                        <div
                            className={"ProductImage_ImageBig"}
                            style={{background:`url(${image}) 50% 50% / ${widthHeight} auto no-repeat`,width:widthHeight,height:widthHeight}}
                            onMouseOver={(e) => {
                                if (propotionX > 0 && propotionY > 0) e.target.style.cursor = "zoom-in"
                                else e.target.style.cursor = "default"
                            }}
                            onMouseMove={e => {
                                if (propotionX > 0 && propotionY > 0) {
                                    e.target.style.background = `url(${image}) -${(e.pageX - e.target.offsetLeft)*propotionX}px -${(e.pageY - e.target.offsetTop)*propotionY}px no-repeat`
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = `url(${image}) 50% 50% / ${widthHeight} auto no-repeat`
                            }}
                        />
                    </a>                     
                </div>
                <div md={4}>
                    <Row className="ProductRating">
                    </Row>
                </div>
                <div md={4} className="ProductColCard">
                    цена за единицу товара
                    <Card className="ProductCard">
                        <div
                            className="ProductCard_Price"
                        >
                            {product.request || price === 0
                            ? <h3>Цена: По запросу</h3>
                            : oldPrice
                                ? <>
                                    <h3>Цена:&nbsp;<span className="ProductCard_Price_oldPrice">{oldPrice} руб.</span></h3>
                                    <h3 className="ProductCard_Price_redPrice">{price} руб.</h3>
                                </>
                                :<h3>Цена: {price} руб.</h3>
                            }
                        </div>
                        <div
                            className="ProductCardDivButtonBuy"
                        >
                            {product.request || price === 0
                            ?
                                <RequestPrice
                                    product={product}
                                    // image={image}
                                >
                                    Запросить цену
                                </RequestPrice>
                            : 
                                <RequestPrice
                                    product={product}
                                    action="Заказ"
                                    multiplier={multiplier}
                                    // image={image}
                                    // notClose
                                >
                                    Заказать товар
                                </RequestPrice>
                            }
                        </div>
                    </Card>
                    в упаковке: {multiplier} шт. 
                </div>
            </div>
            
            {product?.info && Array.isArray(product.info) && product.info[0] !== undefined
            ?
                product.info.map((info, index) => {
                    // if (info.title === "multiplier") {
                    //     setMultiplier(info.body)
                    //     return null
                    // }
                    return (
                    <div 
                        className="ProductInfo"
                        key={info?.id}
                    >
                        {info?.title === "characteristics" || info?.title === "Характеристики"
                        ?
                        <>
                        <h2>Характеристики</h2>
                        <table>
                        { 
                            info?.body.includes("<") && info?.body.includes(">") 
                            ?
                                HtmlReactParser(info?.body)
                            : 
                                typeof(info?.body) === "string" 
                                ? 
                                <tbody>
                                    {JSON.parse(info?.body).map((item,idx) =>  {
                                        return  (
                                            <tr key={idx+"vokak"}>
                                                <td>
                                                {item.name}
                                                </td>
                                                <td>
                                                {item.value}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                : null
                        }
                        </table>    
                        </>
                        : null
                        }                        
                            
                    </div>
                )})
            : null}

            {description &&
            <>
                <br />
                <br />
                <h2>Описание</h2>
                {HtmlReactParser(description)}
            </>}
            
        </Container>
    )
})

export default ProductPage
