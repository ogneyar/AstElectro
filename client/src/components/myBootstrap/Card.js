import React from 'react'
import './Card.css'


const Card = (props) => {

    let className = "Card "

    if (props?.readOnly) {
        className += "readOnly " 
    }else {
        if (props?.variant) {
            className += props.variant + " "
        }else className += "standartCard "
    }
    
    if (props?.className) {
        className += props?.className
    }

    return (
        <div            
            type={props?.type}			
            checked={props?.checked}
            className={className}
            style={props?.style}
            value={props?.value}
            readOnly={props?.readOnly}
            id={props?.id}
            onChange={props?.onChange}
            onClick={props?.onClick}
            title={props?.title}
            placeholder={props?.placeholder}
        >
            {props.children}
        </div>
    )
}

export default Card
