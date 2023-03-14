import React, { useContext, useState, useEffect } from 'react'
import {Modal, Button} from 'react-bootstrap'
import { Context } from '../..'
// import { fetchCategories } from '../../http/categoryAPI'
import { observer } from 'mobx-react-lite'
import AdminCategoryService from '../../service/admin/category/AdminCategoryService'
import './Category.css'


const Category = observer(({show, onHide}) => {

    const { categoryStore } = useContext(Context)

    const [info, setInfo] = useState([])

    useEffect(() => {
        // fetchCategories().then(data => {
        //     category.setCategories(data)
        // })
    },[])
   
    useEffect(() => {
        if (categoryStore.allCategories.length) {
            setInfo(categoryStore.allCategories.filter(i => i.sub_category_id === 0)) 
        }
    },[categoryStore.allCategories])


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
                    Редактор категорий
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <div className='AdminCategoryTitle d-flex flex-column'>
                    <div className='d-flex flex-row'>
                        <div className='ml-2 mr-2'><p>1. Название категории</p></div>
                        <div className='ml-2 mr-2'><p>2. Изменить название</p></div>
                        <div className='ml-2 mr-2'><p>3. Содержит продукцию?</p></div>
                        <div className='ml-2 mr-2'><p>4. удаление категории</p></div>
                    </div>
                </div>

                <AdminCategoryService information={info} idName={"category_"} offset={"null"} sub_id={0} />

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
})

export default Category
