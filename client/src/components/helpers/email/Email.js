
import './Email.css'

const Email = ({ email, setEmail, className, placeholder, withLabel }) => {

    return (
        <div
            className={"Phone"}
        >
            <input 
                className={className}
                type="text" 
                placeholder={placeholder}
                value={email} 
                onChange={e => {
                    setEmail(e.target.value)
                }} 
            />
            {withLabel && <div className="emailHelpLabel">пример: email@mail.ru</div>}
        </div>
    )
}

export default Email