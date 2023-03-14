import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import './Alert.css'

const Alert = ({children, show, onHide, message, centered, background, opacity }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            style={{background, opacity}}
            aria-labelledby="contained-modal-title-vcenter"
            className="Alert"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Внимание
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {children ? children : message}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Alert
