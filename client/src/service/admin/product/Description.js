// eslint-disable-next-line
import React, { useState } from 'react'
// eslint-disable-next-line
import { Button, Form } from 'react-bootstrap'


const Description = ({description, setDescription, action}) => {
    
    // const [visible, setVisible] = useState(false)

    // if (!visible) 
    //     return (
    //         <div>
    //             <label>Описание инструмента:</label>
    //             <br />
    //             <Button variant="outline-primary" onClick={() => setVisible(true)}>
    //                 {action === "edit" && "Изменить данные"}
    //                 {action === "add" && "Добавить самостоятельно"}
    //             </Button>
    //         </div>
    //     )

    return (
        <div>
            <label>Описание инструмента:</label>
            <Form.Control 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className=''
                placeholder={'Введите описание инструмента'}
            />
        </div>
    );
}

export default Description;
