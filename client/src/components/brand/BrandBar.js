
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'

import BrandService from '../../service/brand/BrandService'
import BrandModal from './BrandModal'

import './BrandBar.css'


const BrandBar =  observer((props) => {

    const [brandVisible, setBrandVisible] = useState(false)


    return (
        <div
            className="BrandBar"
        >
            <div
                className="BrandBarPC"
                id="BrandBarPC"
            >
                <BrandService page={props.page || ""} /> 
            </div>

            <div
                className="BrandBarMobile"
                id="BrandBarMobile"
            >
                <label
                    onClick={() => setBrandVisible(true)}
                >
                    Бренды <i className="fa fa-bars" aria-hidden="true"></i>
                </label>
                
                <BrandModal show={brandVisible} onHide={() => setBrandVisible(false)} page={props.page || ""} />

            </div>
        </div>
    )
})

export default BrandBar
