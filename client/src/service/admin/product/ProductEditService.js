import React from 'react';
import { Button, Form } from 'react-bootstrap'

import SearchAdminService from './SearchAdminService.js'
import './ProductEditService.css'


const ProductEditService = (props) => {

    return (
        <Form >
            <hr />

            <SearchAdminService 
                action="edit"
                back={props?.back}
            />

            <div className='DivButtonBack'>
                <Button variant="outline-warning" onClick={props?.back}>Отменить редактирование</Button>
            </div>

            <hr />
        </Form>
    );
}

export default ProductEditService;
