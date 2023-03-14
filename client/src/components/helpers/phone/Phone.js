
import React, { useEffect, useRef, useState } from 'react'

import './Phone.css'


// перед отправкой номера телефона следует убрать лишние символы
// phone = "7" + phone.replace(/\D/g, "")
const Phone = ({ phone, setPhone, className, placeholder, withLabel }) => {
    
    const refPhone = useRef()

    const [ phoneSelection, setPhoneSelection ] = useState("")

    useEffect(() => {
        refPhone.current.selectionStart = phoneSelection
        refPhone.current.selectionEnd = phoneSelection
    },[phone, phoneSelection])
    

    const phoneNumberEdit = (e) => {

        let val = e.target.value
        let offset = 0
        let start = e.target.selectionStart
        let length = val.length
        let lastLength = phone.length
    
        if (val) val = val.match(/\d/g)
    
        if (val) val = val.join('')
    
        let numberLength
    
        if (val) numberLength = val.length
        else numberLength = 0
    
        if (Number(val) || val === "") {
    
            switch(numberLength) {
              
                case 4:
                    val = "(" + val[0] + val[1] + val[2] + ") " + val[3]
                    if (start === length) offset = 3
                break
    
                case 5:
                    val = "(" + val[0] + val[1] + val[2] + ") " + val[3] + val[4]
                break
    
                case 6:
                    val = "(" + val[0] + val[1] + val[2] + ") " + val[3] + val[4] + val[5]
                break
    
                case 7:
                    val = "(" + val[0] + val[1] + val[2] + ") " + val[3] + val[4] + val[5] + "-" + val[6]
                    if (start === length) offset = 1
                break
    
                case 8:
                    val = "(" + val[0] + val[1] + val[2] + ") " + val[3] + val[4] + val[5] + "-" + val[6] + val[7]
                break
    
                case 9:
                    val = "(" + val[0] + val[1] + val[2] + ") " + val[3] + val[4] + val[5] + "-" + val[6] + val[7] + "-" + val[8]
                    if (start === length) offset = 1
                break
    
                case 10:
                    val = "(" + val[0] + val[1] + val[2] + ") " + val[3] + val[4] + val[5] + "-" + val[6] + val[7] + "-" + val[8] + val[9]
                break
              
                default:
                break
            }
    
            if (start !== length) {
                switch(start) {
              
                    case 1:
                        if (lastLength < length) offset = 1
                    // eslint-disable-next-line
                    case 2:
                    case 3:
                        if (lastLength > length && numberLength === 3) offset = -1
                    break
    
                    case 5:
                        offset = 2
                    break
    
                    case 10:
                    case 13:
                        if (lastLength < length) offset = 1
                    break
                    default:
                    break
                }
            }
    
            setPhone(val.toString())
            setPhoneSelection(start + offset)


        }else {
            setPhoneSelection(start)
        }
    
    }
    
    return (
        <div
            className={"Phone"}
        >
            <input 
                className={className}
                ref={refPhone}
                type="text" 
                placeholder={placeholder}
                value={phone}
                maxLength="15"
                onChange={e => {
                    phoneNumberEdit(e)
                }} 
            />
            {withLabel && <div className="phoneHelpLabel">БЕЗ 8, пример: 999 365 43 21</div>}
        </div>
    )
}


export default Phone