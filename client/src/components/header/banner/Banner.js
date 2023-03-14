
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

import { NEWS_ROUTE } from '../../../utils/consts'

import './Banner.css'


const Banner = (props) => {

    const history = useHistory()

    const [ width, setWidth ] = useState(window.innerWidth)
    const [ visibleButton, setVisibleButton ] = useState(false)
    
    useEffect(() => {
        let button = document.querySelector("#Banner_button")
        if (button) {
            let height = width < 720 ? width * 0.286 : width * 0.210
            // button.innerHTML = "смотреть"
            let bottom = width < 720 ? 23 : 18
            button.style.bottom = ((height / 100) * bottom) + "px" // "80px" при height=572 при width=2000
            button.style.right = ((height / 100) * 2) + "px" // "10px" при height=572 при width=2000
            button.style.border = width > 1000 ? "3px solid white" : "1px solid white"
            button.style.borderRadius = ((height / 100) * 4.37) + "px" // "25px"
            button.style.fontSize = ((width / 100) * 0.156) + "rem" // "3.2rem"
            let padding = 2.857
            button.style.paddingTop = width < 720 ? "1px" : "0px"
            button.style.paddingRight = ((height / 100) * padding) + "px" // "12px"
            button.style.paddingBottom = ((height / 100) * 1.4) + "px" // "7px"
            button.style.paddingLeft = ((height / 100) * padding) + "px" // "12px"
        }
    },[width, visibleButton])
    
    const onClickButtonBanner = () => {
        history.push(NEWS_ROUTE + "#mitex22")
    }

    window.addEventListener('resize', () => {
        setWidth(window.innerWidth)
    })

    const onLoadImage = () => {
        setVisibleButton(true)
    }

    return (
        <div
            id="containerBoots"
            className={props?.padding === "bottom" ? "Banner Banner_padding_bottom" : "Banner Banner_padding_top"}
        >
            <div
                className="Banner_img"
            >
                {window.innerWidth < 720 
                ? <img onLoad={onLoadImage} src={"/images/banner/banner.jpg"} alt="banner" />
                : <img onLoad={onLoadImage} hight="100" src={"/images/banner/miniBanner.jpg"} alt="miniBanner" />}
                
                {visibleButton && 
                <button 
                    className="Banner_button"
                    onClick={onClickButtonBanner}
                    id="Banner_button"
                >
                    смотреть
                </button>}
            </div>
        
        </div>
    )

}

export default Banner
