import React, { useContext, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import { fetchProductInfos, fetchProductSizes } from '../../../http/productAPI'
import Loading from '../../../components/Loading';
import { Context } from '../../..'
import ProductService from './ProductService'
import { API_URL } from '../../../utils/consts'
import { Alert } from '../../../components/myBootstrap'
import { searchValue } from '../../../http/searchAPI'
import scrollUp from '../../../utils/scrollUp';


const SearchAdminService = observer((props) => {

    const { productStore, categoryStore, brandStore } = useContext(Context)

    const [article, setArticle] = useState("")
    const [search, setSearch] = useState([])
    const [loading, setLoading] = useState(false)

    const [visibleProductService, setVisibleProductService] = useState(false)

    const [productSearch, setProductSearch] = useState({})

    const [info, setInfo] = useState([])
    const [size, setSize] = useState({})
    
    const [ searchTimeOut, setSearchTimeOut ] = useState(null)

    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }    
    
    // useEffect(() => {
    //     if (productStore.products.length) {
    //         setLoading(false)
    //     }
    // },[productStore.products])


    useEffect(() => {
        if (!loading && article !== "") {
            // setSearch(
            //     productStore.products.filter(
            //         i => i.article.includes(article)
            //     )
            //     // .sort((a, b) => a.article - b.article)
            // )
            
            if (searchTimeOut !== null) {
                clearTimeout(searchTimeOut)
            }
            setSearchTimeOut(setTimeout(async (article) => {
                setLoading(true)
                searchValue({ value: article, limit: productStore.limit, page: productStore.page }).then(
                    data => {
                        setSearch(data.rows)
                        setLoading(false)
                    },
                    error => getError(`Не удалось загрузить товары!`, error)
                ).catch(error => getError(`Не удалось загрузить данные о товарах!`, error))
            }, 1500, article))

            
            

        }else setSearch([])
        // eslint-disable-next-line
    },[article])

    
    const onClickDivArticle = (item) => {
        if (props?.action === "edit") {
            fetchProductInfos(item.id).then(data => {
                if (data[0]?.title !== undefined) setInfo(data)
            })
            fetchProductSizes(item.id).then(data => {
                if (data) setSize(data)
            })
        }
        setSearch([])
        setArticle("")
        categoryStore.categories.forEach(i => {
            if (item.categoryId === i.id) categoryStore.setSelectedCategory(i)
        })
        brandStore.brands.forEach(i => {
            if (item.brandId === i.id) brandStore.setSelectedBrand(i) 
        })
        setProductSearch(item)

        setVisibleProductService(true)
        scrollUp() 
    }


    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />

    
    return (
        <div>
            {loading 
            ? 
                <Loading /> 
            : 
                !visibleProductService
                ?
                    <div 
                        className="inputBox" // этот класс из index.css
                    >
                        <label>Поиск по артикулу: </label>
                        <Form.Control    
                            value={article}
                            onChange={e => setArticle(e.target.value.toString())}
                            placeholder={'Введите артикул'}
                        />
                    </div>
                : null
            }

            {search 
            ? 
                search.map((i,index) => {
                    if (index < 5) {
                        return (
                        <div
                            className={"divArticle"} // этот класс из index.css
                            key={i.id}
                        >
                            <div
                                className="SearchListItem" // этот класс из компонента Search
                                onClick={() => onClickDivArticle(i)}
                            >
                                <img 
                                    className="SearchListItemImg" // этот класс из компонента Search
                                    src={Array.isArray(i.img)  && i.img[0]?.small !== undefined
                                    ? API_URL + i.img[0].small
                                    : API_URL + "unknown.jpg"
                                    } 
                                    alt={i.name}
                                />
                                <div
                                    className="SearchListItemBody" // этот класс из компонента Search
                                >
                                    <div
                                        className="SearchListItemBodyBoxTitle" // этот класс из компонента Search
                                    >
                                        <div
                                            className="SearchListItemBodyName" // этот класс из компонента Search
                                        >
                                            {i.name}
                                        </div>
                                        <div
                                            className="SearchListItemBodyArticle" // этот класс из компонента Search
                                        >
                                            артикул: {i.article}
                                        </div>
                                    </div>

                                    <div
                                        className="SearchListItemBodyPrice" // этот класс из компонента Search
                                    >
                                        <div>
                                            {i.price} р.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}else return null
                }) 
            : 
                null
            }

            {visibleProductService && productSearch?.id
            ? 
                <ProductService 
                    action={props?.action}
                    back={props?.back}
                    id={productSearch?.id}
                    name={productSearch?.name}
                    price={productSearch?.price}
                    file={Array.isArray(productSearch?.img) && productSearch?.img[0]?.small !== undefined
                    ? API_URL + productSearch.img[0].small
                    : API_URL + "unknown.jpg"}
                    url={API_URL}
                    images={productSearch?.img}
                    have={productSearch?.have}
                    article={productSearch?.article}
                    promo={productSearch?.promo}
                    country={productSearch?.country}
                    info={props?.action === "edit" ? info : null}
                    size={props?.action === "edit" ? size : null}
                /> 

            : null}
        </div>
    );
})

export default SearchAdminService;
