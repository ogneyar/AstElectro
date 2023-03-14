import React, { useContext, useEffect } from 'react'
import {Modal, Button} from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
// import { fetchBrands } from '../../http/brandAPI'
import BrandService from '../../service/admin/BrandService'
import { Context } from '../../index'


const Brand = observer(({show, onHide}) => {

    const { brandStore } = useContext(Context)

    useEffect(() => {
        // fetchBrands().then(data => {
        //     brandStore.setBrands(data)
        // })        
    },[])

    
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
                    Редактор брендов
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <BrandService information={brandStore.brands} /> 

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>                
            </Modal.Footer>
        </Modal>
    )
})

export default Brand
 