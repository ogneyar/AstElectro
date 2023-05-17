
import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { Alert } from '../../components/myBootstrap'
import { fetchAllCategories } from '../../http/categoryAPI'
import CategoryPage from '../category/CategoryPage'

import { Context } from '../..'

import './ShopPage.css'


const ShopPage = observer(() => { 

    const {  categoryStore } = useContext(Context)

    const [ loadingCategory, setLoadingCategory ] = useState(true)
    
    // name - имя категории
    let { name } = useParams()


    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }

    useEffect(() => {
        if ( ! name || name === "shop") {
            fetchAllCategories()
                .then(
                    data => {
                        categoryStore.setCategories(data.filter((item,idx) => {
                            if (item.isProduct && !item.categoryInfoId) return false
                            if (item.name.includes("ZKabel")) return false
                            return true
                        }))
                        setLoadingCategory(false)
                        categoryStore.setSelectedCategory({id: 0, name: "Все категории", is_product: true}) // то её нужно обнулить
                    },
                    error => {
                        getError(`Не удалось загрузить категории!`, error)
                        categoryStore.setCategories([{}])
                    }
                )
                .catch(error => getError( `Не удалось загрузить данные о категориях!`, error))
        }
    },[categoryStore, name])


    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />


    return <CategoryPage name={name} /> 

})

export default ShopPage
