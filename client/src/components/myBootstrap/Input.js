import React from 'react'
import './Input.css'


const Input = (props) => {
    let className = "Input "

    
    
    if (props?.readOnly) {
        className += "readOnly " 
    }else {
        if (props?.variant) {
            className += props.variant + " "
        }else className += "standartInput "
    }
    
    if (props?.className) {
        className += props?.className
    }

    return (
        <input  
            type={props?.type}
			variant={props?.variant}
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
        />
    )
}

export default Input
