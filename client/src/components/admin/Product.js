import React, { useState, useContext } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import ProductAddService from '../../service/admin/product/ProductAddService'
import ProductEditService from '../../service/admin/product/ProductEditService'
import ProductDeleteService from '../../service/admin/product/ProductDeleteService'
import { Context } from '../..'

import './Product.css'


const Product = observer(({show, onHide}) => {

    const { categoryStore } = useContext(Context)

    const [addProduct, setAddProduct] = useState(false)
    const [editProduct, setEditProduct] = useState(false)
    const [deleteProduct, setDeleteProduct] = useState(false)

    const back = () => {
        setAddProduct(false)
        setEditProduct(false)
        setDeleteProduct(false)
    }
    
    const onHideAndBack = () => {
        onHide()
        back()
    }

    const onClickButtonAdd = () => {
        categoryStore.setSelectedCategory({}) 
        setAddProduct(true)
        setEditProduct(false)
        setDeleteProduct(false)
    }

    const onClickButtonEdit = () => {
        setAddProduct(false)
        setEditProduct(true)
        setDeleteProduct(false)
    }

    const onClickButtonDelete = () => {
        setAddProduct(false)
        setEditProduct(false)
        setDeleteProduct(true)
    }

    return (
        <Modal
            show={show}
            // onHide={onHideAndBack}
            onHide={() => null}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header 
                // closeButton
            >
                <Modal.Title id="contained-modal-title-vcenter">
                    Редактор продукции
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
            <div className='d-flex flex-column'>
                {addProduct  
                ?
                    <ProductAddService onHide={onHideAndBack} back={back} />
                :
                    <Button
                        className='mt-4 mb-2'
                        variant="outline-primary"
                        onClick={onClickButtonAdd}
                    >
                        Добавить новую продукцию
                    </Button>
                }

                {editProduct  
                ?
                    <ProductEditService onHide={onHideAndBack} back={back} />
                :
                    <Button
                        className='mt-4 mb-2'
                        variant="outline-warning"
                        onClick={onClickButtonEdit}
                    >
                        Редактировать продукцию
                    </Button>
                }

                {deleteProduct  
                ?
                    <ProductDeleteService onHide={onHideAndBack} back={back} />
                :
                    <Button
                        className='mt-4 mb-4'
                        variant="outline-danger"
                        onClick={onClickButtonDelete}
                    >
                        Удалить продукцию
                    </Button>
                }
            </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHideAndBack}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
})

export default Product
