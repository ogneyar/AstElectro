import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { observer } from 'mobx-react-lite'
import { Card } from 'react-bootstrap'

import scrollUp from '../../utils/scrollUp'
import { SCROLL_TOP, SCROLL_TOP_MOBILE } from '../../utils/consts'

import { Context } from '../..'
import './BrandService.css'


const BrandService =  observer((props) => {

    const { productStore, brandStore, categoryStore } = useContext(Context)

    const [info, setInfo] = useState([])

    const history = useHistory()

    useEffect(() => {
        if (brandStore.brands && Array.isArray(brandStore.brands)) setInfo(brandStore.brands)
    },[brandStore.brands])

    const onClickCard = (br) => { 
        if (br) {
            history.push("/"+br?.name.toLowerCase())
        }else {
            history.push("/shop")
        }
        if (window.innerWidth > 991) {
            scrollUp(SCROLL_TOP)
        }else {
            scrollUp(SCROLL_TOP_MOBILE)
        }
        productStore.setPage(1)
        categoryStore.setSelectedCategory({})
    }


    return (
        <div className='BrandService'>
            <div title={(props?.page === "brandPage" || props?.page === "categoryPage") ? "Возврат на страницу товаров!" : ""} >
                <Card
                    style={{cursor: "pointer"}}
                    border={undefined === brandStore.selectedBrand.id ? 'warning' : 'light'}
                    bg={undefined === brandStore.selectedBrand.id ? 'warning' : ''}
                    onClick={() => onClickCard(null)}
                    key={0}
                    className="p-3"
                >
                    {window.innerWidth < 992 ? "В С Е" : "Все бренды"}
                </Card>
            </div>
            {info.map(br => {
				
                if (br.name === "Leidtogi") {

                    return <Card
                        style={{cursor: "pointer", color: br.id === brandStore.selectedBrand.id ? "#000" : "#ff9900"}}
                        border={br.id === brandStore.selectedBrand.id ? 'warning' : 'light'}
                        bg={br.id === brandStore.selectedBrand.id ? 'warning' : ''}
                        onClick={() => onClickCard(br)}
                        key={br.id}
                        className="p-3"
                    >
                        {"LeidTogi"}
                    </Card>

                }else if (
                    br.name === "Milwaukee" 
                    || 
                    br.name === "Husqvarna" 
                    || 
                    br.name === "RGK" 
                    || 
                    br.name === "KVT" 
                    || 
                    br.name === "Gedore"
                    || 
                    // br.name === "TMK"
                    br.name === "Redverg" ||br.name === "Concorde" || br.name === "Kvalitet" 
                    || 
                    br.name === "Advanta"
                    || 
                    br.name === "Euroboor"
                    || 
                    br.name === "Tor"
                    || 
                    br.name === "Krause"
                    || 
                    br.name === "Kedr"
                    || 
                    br.name === "Bycon"
                    || 
                    br.name === "Gefest"
                ) {

                    return <Card
                        style={{cursor: "pointer"}}
                        border={br.id === brandStore.selectedBrand.id ? 'warning' : 'light'}
                        bg={br.id === brandStore.selectedBrand.id ? 'warning' : ''}
                        onClick={() => onClickCard(br)}
                        key={br.id}
                        className="p-3"
                    >
                        {br.name === "RGK" ? "R G K" 
                        : br.name === "KVT" ? "К В Т"
                        : br.name === "Tor" ? "T O R"
                        : br.name === "Redverg" ? "RedVerg"
                        : br.name === "Kvalitet" ? "Квалитет" 
                        : br.name === "Kedr" ? "Кедр" 
                        : br.name}

                    </Card>

                }else return null
                
            })}
        </div>
    )
})

export default BrandService
