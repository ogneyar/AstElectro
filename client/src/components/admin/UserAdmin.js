
import React from 'react'

import { Modal, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'


const UserAdmin = (props) => {
    return (
        <Modal
            show={props?.show}
            // onHide={props?.onHide}
            onHide={() => null}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header 
                // closeButton
            >
                <Modal.Title id="contained-modal-title-vcenter">
                    Редактор пользователей
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
            <div className='d-flex flex-column'>
                В разработке...
            </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={props?.onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default observer(UserAdmin)
