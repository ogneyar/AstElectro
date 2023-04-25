import React from 'react'
import { Spinner } from 'react-bootstrap'


const Loading = (props) => {
    return (
        <div
            className="d-flex justify-content-center align-items-center" 
        >
            <div style={props?.width ? {width: props.width} : {width: 50}} className="p-1 m-1">
                <div>
                    <div
                        className="d-flex justify-content-center align-items-center"
                    >
                        {process.env.REACT_APP_ENV === "develop" && props.text ? props.text + "_Loader" :
                            <Spinner size={props?.size} animation="border" variant={props?.variant || "secondary"} />
                        }
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Loading
