import React from 'react'
import { useHistory } from "react-router-dom";
import {Modal, Button, Form, Row, Col} from 'react-bootstrap'


const DeleteSite = ({show, onHide}) => {

    const history = useHistory()

    const Delete = () => {
        let yes = window.confirm("Вы уверены в том что хотите удалить этот сайт?")
        if (yes) {
            console.log("САЙТ был удалён!");
            history.push("/delete")
        }
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
                    Удалить САЙТ!!!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    className=''
                >
                    <Row
                        className='m-4 p-4 d-flex align-items-center justify-content-center flex-column'
                    >
                        <Col
                            className="p-4 d-flex align-items-center justify-content-center "
                        >
                            Нажмите на кнопу "Удалить"!
                        </Col>
                        <Col
                            className="p-4 d-flex align-items-center justify-content-center"
                        >
                            <Button
                                variant="outline-danger"
                                onClick={ Delete }
                            >
                                Удалить
                            </Button>
                        </Col>
                    </Row>  
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteSite
