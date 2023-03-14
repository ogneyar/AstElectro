import React, { useState, useEffect, useContext } from 'react'
import { Image } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import star from '../../assets/star.png'
import RatingModal from './RatingModal'
import { fetchRating } from '../../http/ratingAPI'
import { Context } from '../..'

import './Rating.css'
import Notification from '../myBootstrap/Notification'


const Rating = observer((props) => {

    const { userStore, ratingStore } = useContext(Context)
    
    const [ratingModalVisible, setRatingModalVisible] = useState(false)
    const [notificationModalVisible, setNotificationModalVisible] = useState(false)

    const [rate, setRate] = useState(0)

    useEffect(() => {
        fetchRating(userStore.user.id, props?.product.id).then(data => {
            if (data?.rate) setRate(data?.rate)
        })
    // eslint-disable-next-line
    },[])


    return (
        <div
            className="Rating" 
        >

            {ratingStore.rate !== 0 && 
            <label
                className="RatingLabel"
            >
                Общий рейтинг товара
            </label>}
            
            <div
                className="RatingBody"
                title="Оценить товар"
                onClick={() => {
                    if (userStore?.user?.id) setRatingModalVisible(true)
                    else setNotificationModalVisible(true)
                }}
            >
                <Image 
                    className="RatingStar" 
                    src={star} 
                />

                <div
                    className="RatingValue"
                >
                    {ratingStore.rate !== 0 
                    ?
                        <label>{ratingStore.rate}</label>
                    :
                        <small>Оценить товар</small>
                    }
                </div>
            </div>

            <RatingModal 
                show={ratingModalVisible} 
                onHide={() => setRatingModalVisible(false)} 
                rate={rate} 
                setRate={setRate} 
                userId={userStore.user.id}
                productId={props?.product.id}
            />

            <Notification 
                show={notificationModalVisible}
                onHide={() => setNotificationModalVisible(false)}
                message={"Для выставления оценки необходимо авторизоваться."}
                time={3000}
            />

        </div>
    )
})

export default Rating
