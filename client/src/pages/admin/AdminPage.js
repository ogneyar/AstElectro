import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import Order from '../../components/admin/OrderAdmin'
import User from '../../components/admin/UserAdmin'
import { fetchAllCategories } from '../../http/categoryAPI'
import { Alert } from '../../components/myBootstrap'
import Category from '../../components/admin/Category'
import Brand from '../../components/admin/Brand'
import Product from '../../components/admin/Product'
import DeleteSite from '../../components/admin/DeleteSite'
import { Context } from '../..'

import './AdminPage.css';
import scrollUp from '../../utils/scrollUp'


const Admin = observer(() => {
    
    const { userStore, productStore, categoryStore, brandStore } = useContext(Context)

    const history = useHistory()

    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }

    useEffect(() => {
        if (productStore.products.length) { 
            // productStore.setProducts(productStore.allProducts)
            // productStore.setTotalCount(productStore.allProducts.length)
        }
    // eslint-disable-next-line
    },[productStore.products])

    useEffect(() => {
        fetchAllCategories()
            .then(
                data => {
                    categoryStore.setCategories(data)
                    categoryStore.setSelectedCategory({id: 0, name: "Все категории", is_product: true}) // то её нужно обнулить
                },
                error => {
                    getError(`Не удалось загрузить категории!`, error)
                    categoryStore.setCategories([{}])
                }
            )
            .catch(error => getError( `Не удалось загрузить данные о категориях!`, error))        
    },[categoryStore])

    useEffect(() => {
        if (brandStore.brands.length) {
            brandStore.setSelectedBrand({})
        }
    // eslint-disable-next-line
    },[brandStore.brands])

    const [orderVisible, setOrderVisible] = useState(false)
    const [userVisible, setUserVisible] = useState(false)
    
    const [categoryVisible, setCategoryVisible] = useState(false)
    const [brandVisible, setBrandVisible] =  useState(false)
    const [productVisible, setProductVisible] = useState(false)
    
    const [deleteSiteVisible, setDeleteSiteVisible] = useState(false)

    
    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />


    return (
        <Container className="Content d-flex flex-column Admin Mobile">
            
            <Button 
                variant={"outline-dark"} 
                className="m-3 p-2 Admin_button"
                onClick={() => setOrderVisible(true)}
            >
                Заказы
            </Button>
            
            {userStore.user?.id === 1 && <hr/>}

            {userStore.user?.id === 1 
            ?
                <Button 
                    variant={"outline-dark"} 
                    className="m-3 p-2 Admin_button"
                    onClick={() => setUserVisible(true)}
                >
                    Редактор пользователей
                </Button>
            : null}

            {userStore.user?.id === 1 && <hr/>}

            {userStore.user?.id === 1 
            ?
                <Button 
                    variant={"outline-dark"} 
                    className="m-3 p-2 Admin_button"
                    onClick={() => setProductVisible(true)}
                >
                    Редактор продукции
                </Button>
            : null}

            {userStore.user?.id === 1 
            ?
                <Button 
                    variant={"outline-dark"} 
                    className="m-3 p-2 Admin_button"
                    onClick={() => setCategoryVisible(true)}
                >
                    Редактор категорий
                </Button>
            : null}

            {userStore.user?.id === 1 
            ?
                <Button 
                    variant={"outline-dark"} 
                    className="m-3 p-2 Admin_button"
                    onClick={() => setBrandVisible(true)}
                >
                    Редактор брендов
                </Button>
            : null}

            {userStore.user?.id === 1 && <hr/>}
            
            {userStore.user?.id === 1 
            ?
                <Button 
                    variant={"outline-dark"} 
                    className="m-3 p-2 Admin_button"
                    onClick={() => {
                        scrollUp()
                        history.push("/parser")
                    }} 
                >
                    Парсер
                </Button>
            : null}

            {userStore.user?.id === 1 && <hr/>}

            {userStore.user?.id === 1 
            ?
                <Button 
                    variant={"outline-dark"} 
                    className="m-3 p-2 Admin_button"
                    onClick={() => {
                        scrollUp()
                        history.push("/tester")
                    }}
                >
                    Тестер
                </Button>
            : null}

            <hr/>

            <Button 
                variant={"outline-danger"} 
                className="m-3 p-2 Admin_button"
                onClick={() => setDeleteSiteVisible(true)}
            >
                Удалить САЙТ!!!
            </Button>
            
            <Order show={orderVisible} onHide={() => setOrderVisible(false)}/>
            <User show={userVisible} onHide={() => setUserVisible(false)}/>

            <Product show={productVisible} onHide={() => setProductVisible(false)}/>
            <Category show={categoryVisible} onHide={() => setCategoryVisible(false)}/>
            <Brand show={brandVisible} onHide={() => setBrandVisible(false)}/>

            <DeleteSite show={deleteSiteVisible} onHide={() => setDeleteSiteVisible(false)}/>
            
        </Container>
    )
})

export default Admin
