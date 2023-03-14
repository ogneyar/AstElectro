import React, { useEffect, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

import InfoPage from './InfoPage'
import { getPromo } from '../../http/productAPI'
import Loading from '../../components/Loading'
import { API_URL, ERROR_ROUTE } from '../../utils/consts'
// import priceFormater from '../../utils/priceFormater'
import ButtonBuy from '../../components/cart/ButtonBuy'
import scrollUp from '../../utils/scrollUp'

import { Context } from '../..'
import './Specials.css'


const Specials = () => {

    const history = useHistory()

    const { brandStore } = useContext(Context)

    const [ loading, setLoading ] = useState(true)
    
    const [ promo, setPromo ] = useState([])

    const [ prod ] = useState(process.env.REACT_APP_ENV === 'production' && (window.location.hostname === "leidtogi.ru" || window.location.hostname === "www.leidtogi.ru") ? true : false)

    useEffect(() => {
        setLoading(true)
        getPromo()
            .then(data => {
                setPromo(data)
            })
            .finally(() => setLoading(false))
    }, [])

    const onClickProduct = (product) => {
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

    return (
        <InfoPage>
            <div className="Specials">
                <header>Акции!</header>
                
                <p>&nbsp;&nbsp;&nbsp;&nbsp;Уважаемые посетители сайта, на этой странице будут размещаться акционные товары, скидки и акционные предложения.</p><br />

                {loading ? <Loading width={200} />

                : promo && Array.isArray(promo) && promo.map(i => {
					// не показывать на продакшине товары которых нет в наличии и не показывать товары с ценою по запросу
					if ( (! i.have && prod) || i.request) return null
					
                    let price = i.price // priceFormater(i.price)
					
                    let img = i.img && JSON.parse(i.img)
					let pro = i.promo && JSON.parse(i.promo)
					
					// if ( pro?.our_brand !== undefined ) return null
					if (pro?.old_price === undefined) return null
						
                    // let oldPrice = priceFormater(Number(pro?.old_price.replace(",", ".")))
                    let oldPrice = pro?.old_price.replace(",", ".")
                    
                    let width = window.innerWidth > 450 ? "150px" 
                        :  window.innerWidth > 350 ? "100px" : "80px"
                    
                    return (
                        <div 
                            key={i.id} 
                            onClick={() => onClickProduct(i)}
                            className="Specials_PromoItem"
                        >
                            <div className="Specials_PromoItem_Header">
                                <div className="Specials_PromoItem_Image">
                                    <img 
                                        src={API_URL + img[0]?.big} 
                                        alt={`Изображение товара с артикулом ${i.article}`} 
                                        width={width}
                                    />
                                </div>
                                <div className="Specials_PromoItem_Body">
                                    <span className="Specials_PromoItem_Body_name">
                                        {i.name}
                                    </span>
                                    <p className="Specials_PromoItem_Body_article">
                                        артикул:&nbsp;{i.article}
                                    </p>
                                </div>
                            </div>
                            <div className="Specials_PromoItem_Footer">
                                <div className="Specials_PromoItem_Footer_price">
                                    {/* <span>Цена:&nbsp;</span> */}
                                    {oldPrice ?
                                    <div className="Specials_PromoItem_Footer_price_old">
                                        Цена:&nbsp;<span>{oldPrice}&nbsp;руб.&nbsp;</span>
                                    </div>
                                    : <span>Цена:&nbsp;</span>}
                                    <span className="Specials_PromoItem_Footer_price_red">
                                        {price}&nbsp;руб.
                                    </span>
                                </div>
                                <div className="Specials_PromoItem_Footer_ButtonBuy">
                                    <ButtonBuy 
                                        product={i}
                                    >
                                        Купить
                                    </ButtonBuy>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        </InfoPage>
    )
}

export default observer(Specials)

