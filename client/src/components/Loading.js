import React from 'react'
import { Spinner } from 'react-bootstrap'


const Loading = (props) => {
    return (
        <div
            className="d-flex justify-content-center align-items-center" 
        >
            <div style={props?.width ? {width: props.width} : {width: 300}} className="p-5 m-5">
                <div>
                    <div
                        className="d-flex justify-content-center align-items-center"
                    >
                        <Spinner size={props?.size} animation="border" variant={props?.variant || "secondary"} />
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Loading
