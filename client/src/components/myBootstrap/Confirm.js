import React from 'react'
import { Modal, Button } from 'react-bootstrap'


import './Confirm.css'


const Confirm = (props) => {

    
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            onClick={e => {
                e.stopPropagation()
                e.preventDefault()
            }}
            className="ConfirmModal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Уведомление
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                className="ConfirmModalBody"
            >
                <div
                    className="ConfirmModalBody_Message"
                >
                    {props.children ? props.children : props?.message}
                </div>
                
                <div
                    className="ConfirmModalBodyDivButtons"
                >
                    <Button
                        variant="danger"
                        onClick={() => {
                            props?.setResponse("yes")
                            props?.onHide()
                        }}
                        // width="100px"
                    >
                        Да
                    </Button>
                    
                    <Button
                        onClick={() => {
                            props?.setResponse("no")
                            props?.onHide()
                        }}
                    >
                        Нет
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    )
}

export default Confirm
