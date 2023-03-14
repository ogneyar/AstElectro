import React, { useState, useContext, useEffect } from 'react'
import {  Image } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import star from '../../assets/star.png'
import { Card } from '../myBootstrap'
import { URL, API_URL, ERROR_ROUTE } from '../../utils/consts'
import ButtonBuy from '../cart/ButtonBuy'
import RequestPrice from '../cart/RequestPrice'
import priceFormater from '../../utils/priceFormater'
import scrollUp from '../../utils/scrollUp'

import { Context } from '../..'
import './Product.css'


const ProductItem = (props) => {

    const [ product, setProduct ] = useState(props?.product)
    
    const history = useHistory()

    const { brandStore } = useContext(Context)

    const [ price, setPrice ] = useState(null)
    const [ oldPrice, setOldPrice ] = useState(null)

    
    useEffect(() => { 
        if (product.img) {
            // на всякий случай, если вдруг забыл разпарсить строку
            if (typeof(product.img) === "string") setProduct({...product, img: JSON.parse(product.img)})
        }
    },[ product ])
    
    useEffect(() => {
        if (product.promo && JSON.parse(product.promo)?.old_price !== undefined) {
            setOldPrice(priceFormater(Number(JSON.parse(product.promo)?.old_price.replace(",", "."))))
        }
        setPrice(priceFormater(product.price))
    },[product.price, product.promo])

    const onClickProductItem = () => {
        // history.push(PRODUCT_ROUTE + '/' + product.id)
        let url = ERROR_ROUTE
        let brandName = "milwaukee" // дефолтное состояние
        brandStore.brands.forEach(i => {
            if (product.brandId === i.id) {
                brandStore.setSelectedBrand(i)
                brandName = i.name
            }
        })
        if (brandName) url = brandName.toLowerCase() + '/' + product?.url
        
        history.push(url)
        scrollUp()
    }

    const onClickContextMenu = (e) => {
        e.preventDefault()
        // window.open("leidtogi")
        props?.setVisibleContextMenu({product, event: e})
    }



    return (
        <div
            className="ProductItem"
            onClick={() => onClickProductItem()}
            onContextMenu={e => onClickContextMenu(e)}
        >
            <Card 
                className="product-card"
            >

                <Image 
                    className="product-image" 
                    src={product.img && Array.isArray(product.img)  && product.img[0]?.big !== undefined
                        ? API_URL + product.img[0].big 
                        : product.brandId === 10 // LeidTogi
                            ? URL + "images/brands/leidtogi/leidtogi_logo_big.jpg"
                        : product.brandId === 9 // TMK
                            ? URL + "images/brands/tmk/tmk_logo_big.jpg"
                            : API_URL + "unknown.jpg"
                    } 
                />

                <div className="product-body">

                    <div className="product-name">
                        {product?.name && product?.name.length > 90
                        ?
                            <div title={product.name}>{product.name.slice(0, 80) + "..."}</div>
                        :
                            product.name
                        }

                        <p>артикул: {product.article}</p>
                        
                    </div> 
 
                    <div className="product-text">
                        
                        <div className="product-price">
                            {product.request || price === 0
                            ? `Цена по запросу` 
                            : oldPrice
                                ? <>
                                    <span className="product-price_redPrice">{price}&nbsp;р.</span>
                                    <span className="product-price_oldPrice">{oldPrice}&nbsp;р.</span>
                                </>
                                : <>{price}&nbsp;р.</>}
                        </div>

                        {product.rating 
                        ? 
                            <div className="product-rating">
                                <div>{product.rating}</div>
                                <Image className="mt-1 ml-1" width={15} height={15} src={star} />
                            </div>
                        : null}

                    </div>
                    
                    {product.request || price === 0
                    ? 
                    <RequestPrice product={product}>
                        ЗАПРОСИТЬ
                    </RequestPrice> 
                    : 
                    <ButtonBuy product={product}>
                        КУПИТЬ
                    </ButtonBuy>}
                    

                </div>

            </Card>


        </div>
    )
}

export default ProductItem 
