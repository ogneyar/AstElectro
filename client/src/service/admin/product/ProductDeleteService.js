import React from 'react';
import { Button, Form } from 'react-bootstrap'

import SearchAdminService from './SearchAdminService.js'
import './ProductDeleteService.css'


const ProductDeleteService = (props) => {
  
    return (
        <Form>
            <hr />
  
            <SearchAdminService
                action="del"
                back={props?.back}
            />

            <div className='d-flex justify-content-end mt-3'>
                <Button variant="outline-warning" onClick={props?.back}>Отменить удаление</Button>
            </div>

            <hr />
        </Form>
    );
}

export default ProductDeleteService;
