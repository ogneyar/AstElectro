import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
// import { Form } from 'react-bootstrap'
import { createBrand, deleteBrand, updateBrand } from '../../http/brandAPI'
import { Input, Button, Form } from '../../components/myBootstrap'
import { Context } from '../../index'


const BrandService = observer(({information}) => {

    const { brandStore } = useContext(Context)
    const [ value, setValue ] = useState('')

    const [ info, setInfo ] = useState(information)

    const [state, setState] = useState(information.map(i => {
        return {id:i.id,readOnly:true,cursor:"pointer",bEdit:"flex",bApply:"none"}
    }))

    const delBrand = async (id, name) => {
        let yes = window.confirm(`Вы уверены, что хотите удалить бренд ${name}? Вместе с ним удалятся и привязаные к нему товары, если таковые имеются! Будьте внимательны!!! Удаляем?!`)
        if (yes) {
            await deleteBrand(id)
            
            brandStore.setBrands(
                brandStore.brands.filter(i => i.id !== id)
            )
            setInfo(brandStore.brands)
        }
    }
    
    const editBrand = (id) => {
        setState(
            state.map(i => i.id === id 
                ? {...i, readOnly:false,cursor:"text",bEdit:"none",bApply:"flex"} 
                : i
            )
        )
    }

    const editBrandApply = async (id, name) => {
        setState(
            state.map(i => i.id === id 
                ? {...i, readOnly:true,cursor:"pointer",bEdit:"flex",bApply:"none"} 
                : i 
            )
        )        
        await updateBrand(id, {name})
    }

    const addBrand = () => {
        createBrand({name: value}).then(data => {
            setValue('')
            brandStore.setBrands([...brandStore.brands, ...data])
            setInfo(brandStore.brands)
        })        
    }


    return (
        <div>
            {info && info.map((i, number) => {

                if (i.id === undefined) return <div key={42}/>

                return (
                <div                    
                    className='mb-4 d-flex flex-column'
                    key={i.id}
                >
                    
                    <div
                        className='mt-4 d-flex flex-row'
                    >
                        <div
							style={{width:"100%"}}
                            className='ml-2 mr-2'
						>
                            <Input
                                className='mt-1'
                                style={{cursor:state[number]?.cursor,width:"100%"}}
                                value={i.name}
                                readOnly={state[number]?.readOnly}
                                id={i.id}
                                onChange={e => {
                                    setInfo(info.map(k => i.id === k.id ? {...k, name:e.target.value} : k))
                                }}            
                                title="Название бренда"
                            />
                        </div>
                        
                        <div
                            className='ml-2 mr-2'
						>
                            <Button
                                variant="outline-primary"
                                onClick={() => editBrand(i.id)}
                                style={{display:state[number]?.bEdit}}
                                className='mt-1'
                                id={"button_" + i.id}
                                title="Изменить название бренда"
                            >
                                Изменить...
                            </Button>

                            <Button
                                variant="outline-warning"
                                onClick={() => editBrandApply(i.id, i.name)}
                                style={{display:state[number]?.bApply}}
                                className='mt-1'
                                id={"button_warning_" + i.id}
                                title="Применить изменение названия"
                            >
                                Применить
                            </Button>
                        </div>

                        <div
                            className='ml-2 mr-2'
						>
                            <Button
                                variant="outline-danger"
                                onClick={() => delBrand(i.id, i.name)}
                                className='mt-1'
                                title="Удаление бренда"
                            >
                                Удалить
                            </Button>
                        </div>

                    </div>

                </div>)}
            )}

            <Form
                className='mt-4'
            >
                <Input
                    className='ml-2 mr-2'
                    style={{width:"100%"}}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={'Введите название бренда'}
                />
                <Button 
                    className='ml-2 mr-2 mt-2'
                    variant="outline-success" 
                    onClick={addBrand}
                >
                    Добавить
                </Button>
            </Form>
                
            
        </div>
    )
})

export default BrandService 
