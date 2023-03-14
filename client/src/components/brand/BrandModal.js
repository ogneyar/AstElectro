
import React from 'react'
import { Modal } from 'react-bootstrap'

import BrandService from '../../service/brand/BrandService'


const BrandModal = ({show, onHide, page}) => {
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
                    Бренды
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <BrandService onHide={onHide} page={page || ""} />

            </Modal.Body>
        </Modal>
    )
}

export default BrandModal
 