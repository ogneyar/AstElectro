// eslint-disable-next-line
import React, { useState } from 'react'
// eslint-disable-next-line
import { Button, Form } from 'react-bootstrap'


const Equipment = ({equipment, setEquipment, action}) => {
   
    // const [visible, setVisible] = useState(false)

    // if (!visible) 
    //     return (
    //         <div>
    //             <label>Комплектация:</label>
    //             <br />
    //             <Button variant="outline-primary" onClick={() => setVisible(true)}>
    //                 {action === "edit" && "Изменить данные"}
    //                 {action === "add" && "Добавить самостоятельно"}
    //             </Button>
    //         </div>
    //     )

    return (
        <div>
            <label>Комплектация:</label>
            <Form.Control 
                value={equipment}
                onChange={e => setEquipment(e.target.value)}
                className=''
                placeholder={'Введите комплектацию инструмента'}
            />
        </div>
    )
}

export default Equipment;
