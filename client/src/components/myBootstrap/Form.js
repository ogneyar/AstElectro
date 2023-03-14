import './Form.css'


const Form = (props) => {

    let className = "Form "

    if (props?.readOnly) {
        className += "readOnly " 
    }

    if (props?.variant) {
        className += props.variant + " "
    }

    if (props?.className) {
        className += props.className
    }

    return (
        <form 
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
            onSubmit={e => e.preventDefault()}
        >
            
            {props?.children}

        </form>
    )
}

export default Form