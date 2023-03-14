import React from 'react';
import { Button } from 'react-bootstrap'

import ProductService from './ProductService';

import './ProductAddService.css'


const ProductAddService = (props) => {

    return (
        <div className=''>
            <hr />
            
            <ProductService
                action="add"
                back={props?.back}
            /> 

            <div className='DivButtonBack'>
                <Button variant="outline-warning" onClick={props?.back}>Отменить добавление</Button>
            </div>

            <hr />
        </div>
    );
}

export default ProductAddService;
