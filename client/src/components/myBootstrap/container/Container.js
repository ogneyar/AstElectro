import './Container.css'


const Container = (props) => {
    let className = "Contain "
    
    if (props?.className) {
        className += props?.className
    }

    return (
        <div
            className = "Container"
        >
            <div 
                className={className}
                style={props?.style}
                id={props?.id}
                onClick={props?.onClick}
            >

                {props?.children}
                
            </div>
        </div>
    )
}

export default Container