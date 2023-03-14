import React, { useState, useEffect, useContext } from 'react'
import {Modal, Button} from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import { createRating, updateRating, fetchAllRating } from '../../http/ratingAPI'
import { 
    updateRatingProduct, 
    // fetchAllProducts 
} from '../../http/productAPI'
import { Context } from '../..'
import './RatingModal.css'


const RatingModal = observer(({ show, onHide, rate, setRate, userId, productId }) => {

    const { 
        rating, 
        // productStore 
    } = useContext(Context)

    const [info, setInfo] = useState([])

    // ПРИМЕР: info = [ { id, color, checked }, ... ]

    const [state, setState] = useState([])
    
    useEffect(() => {
        let array = calculateArrayRating(rate)
        setInfo(array)
        setState(array)
    },[rate])

    
    const calculateArrayRating = (rate) => {
        let array = []
        let color, checked
        for(let i = 1; i <= 5; i++) {
            color = "white"
            checked = false
            if (rate && rate >= i) {
                color = "red"
                if (rate === i) checked = true
            }
            array = [...array, {
                id:i,
                color,
                checked
            }]
        }
        return array
    }


    const onMouseEnterLabel = (id) => {
        setInfo(info.map(i => {
            if (i.id <= id) return {...i,color:"orange"}
            return {...i,color:"white"}
        }))
    }

    const onMouseLeaveLabel = () => {
        setInfo(state)
    }

    const onClickLabel = (id) => {

        if (rate) {
            updateRating(userId, productId, id).then(() => updateRateFunction(productId))
        }else {
            createRating(userId, productId, id).then(() => updateRateFunction(productId))
        }

        setRate(id)
    }

    const updateRateFunction = (productId) => {
        fetchAllRating(productId).then(data => {
            let rate = 0
            data.forEach(i => {
                if (i.rate !== undefined) rate = rate + i.rate
            })
            if (rate !== 0) {
                if( rate % data.length === 0 ) {
                    rate = rate / data.length
                }else {
                    rate = (rate / data.length).toFixed(1)
                }
            }
            updateRatingProduct(productId, rate).then(yes => {
                // fetchAllProducts().then(data => productStore.setProducts(data))
            })
            rating.setRate(rate)
        })
    }


    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Оцените товар
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="box"
            >
                <div>
                    <div
                        className="box-title"
                    >
                        {rate ? "Ваша оценка - " + rate : ""}
                    </div>
                
                    <div
                        className="rating-box"
                    >   
                        <div
                            className="rating-box__items"
                        >   
                            {info.map(i => 
                                <div key={i.id}>
                                    <input
                                        className="rating-box__item" 
                                        type="radio"
                                        id={"rating-box__"+i.id}
                                        value={i.id}
                                        // checked={i.checked}
                                    />
                                    <label
                                        className="rating-box__label" 
                                        htmlFor={"rating-box__"+i.id}
                                        onMouseEnter={() => onMouseEnterLabel(i.id)}
                                        onMouseLeave={() => onMouseLeaveLabel(i.id)}
                                        onClick={() => onClickLabel(i.id)}
                                        style={{color:i.color}}
                                    ></label>
                                </div>
                            )}
                            

                        </div>
                    </div>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
})

export default RatingModal
