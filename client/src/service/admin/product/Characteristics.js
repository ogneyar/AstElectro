// eslint-disable-next-line
import React, { useState } from 'react'
// eslint-disable-next-line
import { Button, Form } from 'react-bootstrap'


const Characteristics = ({characteristics, setCharacteristics, action}) => {

    // const [visible, setVisible] = useState(false)

    // if (!visible) 
    //     return (
    //         <div>
    //             <label>Характеристики:</label>
    //             <br />
    //             <Button variant="outline-primary" onClick={() => setVisible(true)}>
    //                 {action === "edit" && "Изменить данные"}
    //                 {action === "add" && "Добавить самостоятельно"}
    //             </Button>
    //         </div>
    //     )

    return (
        <div
            className='Characteristics'
        >
            <label>Характеристики:</label>
            <Form.Control   
                value={characteristics}
                onChange={(e) => setCharacteristics(e.target.value)}
                placeholder={'Введите характеристики'}
            />
        </div>
    );
}

export default Characteristics;