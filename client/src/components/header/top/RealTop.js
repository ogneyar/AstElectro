
import React from 'react'
import { Navbar } from 'react-bootstrap'

import './RealTop.css'


const RealTop = () => {
    
    return (      
        <div
            className="RealTop"
        >
            <Navbar 
                bg="secondary" 
                variant="secondary" 
                className="RealTop_Navbar"
            >
                <div
                    className="RealTop_Container"
                >
                    <div className="RealTop_Row">
                        <div 
                            className="RealTop_Col" 
                        >
                            Оптовая продажа электротехнической продукции
                        </div>
                    </div>
                </div>
            </Navbar>
        </div>
    )
}

export default RealTop
