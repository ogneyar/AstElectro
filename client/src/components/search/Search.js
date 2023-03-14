
import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Spinner } from 'react-bootstrap'

import { API_URL, SCROLL_TOP, SCROLL_TOP_MOBILE } from '../../utils/consts'
import priceFormater from '../../utils/priceFormater'
import scrollUp from '../../utils/scrollUp'

import { Context } from '../..'
import './Search.css'
import { searchValue } from '../../http/searchAPI'


const Search = observer((props) => {
    
    const { productStore, brandStore } = useContext(Context)

    const [ admin, setAdmin ] =  useState(false)

    const [ value, setValue ] = useState("")
    const [ list, setList ] = useState([])
    const [ searchTimeOut, setSearchTimeOut ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    // если поиск не дал результатов
    const [ noSearch, setNoSearch ] = useState(false)

    const history = useHistory()


    // производим поиск на сервере
    const setChangesSearch = async (search) => {
        setLoading(true)
        setNoSearch(false)
        setList([])
        if (search.indexOf("!") === 0) {
            setAdmin(true)
            search = search.replace("!","")
        }

        searchValue({ value: search, page: productStore.page, limit: productStore.limit })
            .then(data => {
                setList(data.rows)
                setLoading(false)
            })        
    }

    // при изменении значения в поле поиска устанавливаем таймаут
    const onChangeSearchInputValue = async (search) => {
        setValue(search)
        if (search) {
            if (searchTimeOut !== null) {
                clearTimeout(searchTimeOut)
            }
            setSearchTimeOut(setTimeout(async (search) => {
                await setChangesSearch(search)
            }, 800, search))
        }else setList([])
    }

    // при нажатии на поле поиска
    const onClickSearchInput = async (search) => {
        setValue(search)
        if (search) {
            await setChangesSearch(search)
        }else setList([])
    }


    const onClickFon = (e) => {
        setList([])
        setNoSearch(false)
    }

    const redirectOnSearch = (key, val) => {
        if (loading) return
        setList([])
        setNoSearch(false)
        if (key === "value" && val !== "")
            history.push(`/search?${key}=${val}`)
        else if (key === "article")
            if (admin) history.push(`/product/${val.id}`)
            else {
                let brandName
                brandStore.brands.forEach(i => {
                    if (val.brandId === i.id) brandName = i.name.toLowerCase()
                })
                history.push(`/${brandName}/${val.url}`)
            }
        scrollUp(SCROLL_TOP || SCROLL_TOP_MOBILE)
    }

    const onKeyDownInput = (e) => {
        if (e.key === "Enter" && value) redirectOnSearch("value", e.target.value.trim())
    }
    

    return (
        <div className="SearchComponent">
            <div className="SearchWrapper">
                {props?.label ? <label>&nbsp;{props.label}</label> : null}
                <div className="SearchBox">
                    <div id="searchDiv" className="SearchDiv">
                        <input 
                            className="SearchInput" 
                            type="text" 
                            autoComplete="off" 
                            name="search" 
                            id="search" 
                            placeholder="Поиск" 
                            value={value}
                            onChange={e => onChangeSearchInputValue(e.target.value)}
                            onClick={async (e) => await onClickSearchInput(e.target.value)}
                            onKeyDown={e => onKeyDownInput(e)}
                        />

                        <span className="InputGroupButton">
                            <button 
                                type="text" 
                                className="SearchButton btn btn-default"
                                onClick={() => redirectOnSearch("value", value)}
                            > 
                                {loading 
                                ? <Spinner size="sm" animation="border" variant="secondary" />
                                : <i className="fa fa-search " />
                            }
                            </button>
                        </span>

                    </div>
                </div>
                
                {list && list.length > 0
                ?
                    <div 
                        className="SearchListBox"
                    >
                        <div 
                            className="SearchList"
                        >
                            {list.map((i, index) =>
                                index < 5 && 
                                <div
                                    key={i.id}
                                >
                                <div
                                    className="SearchListItem"
                                    onClick={() => redirectOnSearch("article", i)}
                                >
                                    <img 
                                        className="SearchListItemImg" 
                                        src={Array.isArray(i.img) && i.img[0]?.big !== undefined
                                            ? API_URL + i.img[0].small
                                            : typeof(i.img) === "string" 
                                                ? JSON.parse(i.img)[0].small !== undefined 
                                                    ? API_URL + JSON.parse(i.img)[0].small
                                                    : API_URL + "unknown.jpg"
                                                : API_URL + "unknown.jpg"
                                        } 
                                        alt={i.name}
                                    />
                                    <div
                                        className="SearchListItemBody"
                                    >
                                        <div
                                            className="SearchListItemBodyBoxTitle"
                                        >
                                            <div
                                                className="SearchListItemBodyName"
                                            >
                                                {i.name}
                                            </div>
                                            <div
                                                className="SearchListItemBodyArticle"
                                            >
                                                артикул: {i.article}
                                            </div>
                                        </div>

                                        <div
                                            className="SearchListItemBodyPrice"
                                        >
                                            <div> 
                                                {i.price > 0 && i.request === 0 ? "Цена: " + priceFormater(i.price) + " р." : "Цена по запросу"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            )}
                            {list.length > 5 
                            ?
                            <>
                                <div
                                    className="SearchListBottom"
                                    onClick={(e) => redirectOnSearch("value", value)}
                                >
                                    Показать все
                                </div>
                            </>
                            :
                                null
                            }
                        </div>

                        
                    </div>
                :
                    noSearch 
                    ? 
                    <div className="SearchListBox">
                        <div className="SearchList">
                            <div className="SearchListItem">
                                <div className="SearchListItemBody">
                                    <div className="SearchListItemBodyPrice">
                                        Поиск не дал результата...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
                }

            </div>

            {(list && list.length > 0) || noSearch
            ? <div className="fon" onClick={e => onClickFon(e)} />
            : null}

        </div>
    );
})

export default Search;
