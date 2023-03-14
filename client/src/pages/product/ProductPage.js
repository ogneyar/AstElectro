import React, { useEffect, useState, useContext } from 'react'
import { Card, Container, Image, Row } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import HtmlReactParser from 'html-react-parser'

import { fetchOneProduct, fetchOneProductOnUrl } from '../../http/productAPI'
import { URL, API_URL } from '../../utils/consts'
import Error from '../error/ErrorPage'
import Loading from '../../components/Loading'
import ButtonBuy from '../../components/cart/ButtonBuy'
import Rating from '../../components/rating/Rating'
import detailDataLayer from '../../service/dataLayer/detail'
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

    // const [light, setLight] = useState(true)

    const alertError = (err) => {
        if (typeof(err) === "string") alert(err)
        if (typeof(err) === "object") alert(JSON.stringify(err))
    }
    
    useEffect(() => {
        if (id) {
            fetchOneProduct(id)
                .then(data => {
                    if (!data?.id) {
                        // history.push("/error")
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
        }else if (product.brandId === 9) {
            setImage(URL + "images/brands/tmk/tmk_logo_big.jpg")
        }
    },[product.img, product.brandId])
    
    useEffect(() => {
        if (image !== API_URL + "unknown.jpg" && image !== URL + "images/brands/tmk/tmk_logo_big.jpg") {
            const img = document.createElement('img')
            img.onload = e => {
                // setPropotionX(Math.round(img.width / widthHeightInt - 1))
                // setPropotionY(Math.round(img.height / widthHeightInt - 1))
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
                        // history.push("/error")
                        window.location.href = "/error"
                    }else {
                        brandStore.brands.forEach(i => {
                            if (data?.brandId === i?.id) 
                                if (i?.name.toLowerCase() !== props?.brandName) history.push("/" + props?.brandName)
                                // else brand.setSelectedBrand(i)
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
        detailDataLayer({ // Яндекс.Метрика
            article: product?.article,
            name: product?.name,
            price: product?.price,
        })
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
                        {product.img && Array.isArray(product.img) && product.img[0]?.big !== undefined
                        ? product.img.map(i => {
                            return (
                                <Image 
                                    key={i.small + new Date()}
                                    className="ProductImageSmall"
                                    width={80} 
                                    onClick={(e) => {
                                        setImage(API_URL + i.big)
                                    }}
                                    src={API_URL + i.small} 
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
                        <Rating product={product} rating={ratingStore.rate} />
                    </Row>
                </div>
                <div md={4} className="ProductColCard">
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
                                >
                                    Запросить цену
                                </RequestPrice>
                            : 
                                <ButtonBuy 
                                    className="ProductCardButtonBuy" 
                                    product={product}
                                >
                                    Добавить в корзину
                                </ButtonBuy>
                            }
                        </div>
                    </Card>
                </div>
            </div>
            
            {product?.info && Array.isArray(product.info) && product.info[0]?.title !== undefined
            ?
                product.info.map((info, index) =>
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
                                info?.body.includes(";") 
                                ? HtmlReactParser(info?.body.split(";").map((i, idx) => {
                                    let jsx = ""
                                    if (idx === 0) jsx += `<tbody><tr><td>${i}</td>`
                                    else if ((idx+1) % 2 === 0) jsx += `<td>${i}</td></tr>` // если чётный элемент
                                    else jsx += `<tr><td>${i}</td>` // если не чётный элемент
                                    if ((idx+1) === info?.body.split(";").length) jsx += `</tbody>`
                                    return jsx
                                }).join(""))
                                : info?.body
                        }
                        </table>    
                        </>
                        : info?.title === "description" && info?.body.length < 4096 // у бренда "tor" 77 товаров с description > 4096 символов не влезли целиком в БД
                            ? 
                            <>
                            <h2>Описание</h2>
                            <div>
                            {
                                HtmlReactParser(info?.body)
                            }
                            </div>
                            </>
                            : info?.title === "equipment" 
                                ? 
                                <>
                                <h2>Комплектация</h2>
                                <table>
                                {
                                    info?.body.includes("<") && info?.body.includes(">") 
                                    ?
                                        HtmlReactParser(info?.body)
                                    :
                                        info?.body.includes(";") 
                                        ? HtmlReactParser(info?.body.split(";").map((i, idx) => {
                                            let jsx = ""
                                            if (idx === 0) jsx += `<tbody>`
                                            jsx += `<tr><td>${i}</td></tr>`
                                            if ((idx+1) === info?.body.split(";").length) jsx += `</tbody>`
                                            return jsx
                                        }).join(""))
                                        : info?.body
                                }
                                </table>
                                </> 
                                : null
                        }
                            
                    </div>
                )
            : null}
            
            {product.size && product.size.length > 0
            ?
            <div className="ProductSize">
                <h2>Габариты</h2>
                {product.size[0].weight 
                ?
                <>
                    <div className={light ? "ProductInfoRowLight" : "ProductInfoRowTansparent"}>Вес: {product.size[0].weight} кг</div> 
                    {light = ! light}
                </>
                : null}
                {product.size[0].length 
                ?
                <>
                    <div className={light ? "ProductInfoRowLight" : "ProductInfoRowTansparent"}>Длина: {product.size[0].length} мм</div>
                    {light = ! light}
                </>
                : null}
                {product.size[0].width 
                ?
                <>
                    <div className={light ? "ProductInfoRowLight" : "ProductInfoRowTansparent"}>Ширина: {product.size[0].width} мм</div>
                    {light = ! light}
                </>
                : null}
                {product.size[0].height 
                ?
                <>
                    <div className={light ? "ProductInfoRowLight" : "ProductInfoRowTansparent"}>Высота: {product.size[0].height} мм</div>
                    {light = ! light}
                </>
                : null}
                {product.size[0].volume 
                ?
                <>
                    <div className={light ? "ProductInfoRowLight" : "ProductInfoRowTansparent"}>Объём: {product.size[0].volume} м.куб</div>
                    {light = ! light}
                </>
                : null}
            </div>
            : null}
            
        </Container>
    )
})

export default ProductPage
