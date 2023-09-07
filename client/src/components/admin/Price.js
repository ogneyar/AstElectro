
import React, { useContext, useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import Loading from '../Loading'
import { updatePrice } from '../../http/testerAPI'

import { Context } from '../..'
import './Price.css'


const Price = observer(({show, onHide}) => {

    const { categoryStore } = useContext(Context)

    const [ loader, setLoader ] = useState(false)
    const [ message, setMessage ] = useState(null)
   
    useEffect(() => {
    },[])

    const onClickUpdatePrice = async () => {
        setLoader(true)
        setMessage(null)
        await updatePrice().then(data => {
            if (data == true) {
                setMessage("Цены обновлены.")
            }else {
                setMessage(data)
            }
            setLoader(false)
        })
    }
    

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Настройка цен
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='AdminCategoryTitle d-flex flex-column'>
                    <div className=''>
                        {/* в разработке... */}
                        {message &&
                        <>
                            {message}
                            <br />
                        </>}
                        {loader ?
                            <Loading />
                        :
                            <Button
                                variant="outline-success"
                                onClick={onClickUpdatePrice}
                            >
                                Обновить цены сейчас
                            </Button>
                        }                        
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
})

export default Price
