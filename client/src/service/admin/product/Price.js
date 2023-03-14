// eslint-disable-next-line
import React, { useState } from 'react'
// eslint-disable-next-line
import { Button, Form } from 'react-bootstrap'


const Price = ({price, setPrice, action}) => {
    
    // const [visible, setVisible] = useState(false)

    // if (!visible) 
    //     return (
    //         <div>
    //             <label>Стоимость инструмента:</label>
    //             <br />
    //             <Button variant="outline-primary" onClick={() => setVisible(true)}>
    //                 {action === "edit" && "Изменить данные"}
    //                 {action === "add" && "Добавить самостоятельно"}
    //             </Button>
    //         </div>
    //     )

    return (
        <div>
            <label>Стоимость инструмента:</label>
            <Form.Control 
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className=''
                placeholder={'Введите стоимость инструмента'}
                type="number"
            />
        </div>
    )
}

export default Price;
