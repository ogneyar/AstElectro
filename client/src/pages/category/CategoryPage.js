
import React, { useEffect, useContext, useState } from 'react'
import { Container } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import CategoryBar from '../../components/category/CategoryBar'
import Loading from '../../components/Loading'
import { Alert } from '../../components/myBootstrap'
import { fetchAllCategories } from '../../http/categoryAPI'

import { Context } from '../..'
import './CategoryPage.css'
import CategoryList from '../../components/category/CategoryList'


const CategoryPage = observer((props) => { 

    const { categoryStore } = useContext(Context)

    const [ loadingCategory, setLoadingCategory ] = useState(true)
    
    const [ nameCategory, setNameCategory ] = useState("")

    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }
        

    useEffect(() => {
        fetchAllCategories()
            .then(
                data => {
                    categoryStore.setCategories(data.filter((item,idx) => {
                        // if (idx === 1) console.log(item)
                        if (item.isProduct && !item.categoryInfoId) return false
                        if (item.name.includes("ZKabel")) return false
                        return true
                    }))
                    if (categoryStore.selectedCategory.id !== undefined) {// если есть выбраная категория
                        categoryStore.setSelectedCategory({}) // то её нужно обнулить
                    }
                    setLoadingCategory(false)
                    setNameCategory(props.name) // от этого стейта зависит юзэффект ниже, поэтому его обновляем после загрузки категорий
                },
                error => {
                    getError(`Не удалось загрузить категории!`, error)
                    categoryStore.setCategories([{}])
                }
            )
            .catch(error => getError( `Не удалось загрузить данные о категориях!`, error))
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        if (categoryStore.categories.length && nameCategory) {
            setLoadingCategory(true)
            const reOpenCategory = (array, item) => { // рекурсивная функция для открытия выбраных подкаталогов
                let response = []
                array.forEach(i => {
                    if (item && item === i.id) {
                        response = [...response, i.id]
                        response = [...response, ...reOpenCategory(array, i.sub_category_id)]
                    }
                })
                return response
            }    
            let arrayCategory = []            
            let arr = categoryStore.categories.filter(i => { 
                if (i.url === nameCategory) { // если в url указан категория (напиример: /instrumenti)
                    categoryStore.setSelectedCategory(i) // то сделать её выделенной
                    arrayCategory = [...arrayCategory, i.id]
                    arrayCategory = [...arrayCategory, ...reOpenCategory(categoryStore.categories, i.sub_category_id)]
                    return true
                }
                return false
            })    
            let returnSelectedCategory = arr[0]    
            if ( ! returnSelectedCategory ) { // если категория не найдена
                window.location.href = "/error"
            }else {    
                let returnArrayCategories = categoryStore.categories.map(i => {
                    let yes = false
                    for (let item = 0; item < arrayCategory.length; item++) {
                        if (i.id === arrayCategory[item]) {
                            yes = true
                            break
                        }
                    }
                    if (yes) return { ...i, open: true } // то её надо открыть
                    return { ...i, open: false }
                })     
                categoryStore.setCategories(returnArrayCategories)                
                setLoadingCategory(false)
            }
        }
        
    // eslint-disable-next-line
    },[ nameCategory ])



    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />

    if (loadingCategory || categoryStore.loading) return <Loading variant="warning" text="categoryPage" />

    return (
        <Container
            className="CategoryPage Mobile"
        >
            <div className="CategoryPage_Row">
                <div className="CategoryPage_ColCategory">
                    <CategoryBar page="categoryPage" />
                </div>
                <div className="CategoryPage_ColContent">
                    <div className="CategoryPage_ProductList">
                        <CategoryList id={categoryStore.selectedCategory.id} />
                    </div>                    
                </div>
            </div>
        </Container>
    )
})

export default CategoryPage
