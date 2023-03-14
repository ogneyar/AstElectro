import React, { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { createCategory, fetchAllCategories } from '../../../http/categoryAPI'
import { Input, Button, Form } from '../../../components/myBootstrap'
import translite from '../../../utils/translite'
import { Context } from '../../../index'


const CategoryAddService = observer(({
        sub_id,     // номер подкатегории
        offset,     // отступ margin или обозначение вложенности сервиса
        updateInfo  // передаваемая функция для применения изменений
    }) => {
    
    const { category } = useContext(Context)

    const [name, setName] = useState('')
    const [data, setData] = useState([])

    useEffect(() => {
        if(category.allCategories.length) setData(category.allCategories)
    },[category.allCategories])

    const addCategory = () => {
        if (name && data[0]?.id !== undefined) {
            // fetchAllCategories().then(data => {

                let url = translite(name) 
                let yes = false
                data.forEach(i => {
                    if (url === i.url) yes = true
                })
                if (yes) {
                    if (sub_id) {
                        data.forEach(i => {
                            if (sub_id === i.id) url = translite(i.name) + "_" + url
                        })
                    }else url = url + "_too"
                }
                createCategory(name.trim(), url, sub_id).then(data => { 
                    setName('')
                    updateInfo(sub_id, data, "context", offset) 
                    updateInfo(sub_id, data, "state", offset)

                    fetchAllCategories().then(data => category.setAllCategories(data))
                })
            // })
        }
    }
       
    
    return (
        <Form
            style={{width:"100%"}}
            className={offset === "null" ? "" : "ml-4"}
        >
            <Input 
                className='mt-4 ml-2 mr-2'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={'Введите название новой категории'}
            />
            <Button 
                variant="outline-success" 
                onClick={addCategory}
                className='mt-4 ml-2 mr-2'
                text="Добавить категорию"
            >
                Добавить категорию
            </Button>
        </Form>
    )
})

export default CategoryAddService
