
import { useState, useEffect } from 'react' 
import { useQueryParam, StringParam } from 'use-query-params'
import Loading from '../../components/Loading'
import { getItems, getStructure } from '../../http/parser/nzetaAPI'

import InfoWidePage from '../info/InfoWidePage'

import './UpdateProductsPage.css'


const UpdateProductsPage = () => {

    const [ token ] = useQueryParam('token', StringParam)

    if (token !== process.env.REACT_APP_TOKEN_UPDATES) return <InfoPage>У Вас нет допуска к этой странице!</InfoPage>
    
    const [ items, setItems] = useState("")
    const [ loadingItems, setLoadingItems ] = useState(true)
    const [ structure, setStructure] = useState("")
    const [ loadingStructure, setLoadingStructure ] = useState(true)

    useEffect(() => {            
        getItems(token, "zeta21923")
        .then(
            data => {
                setItems(data)
                setLoadingItems(false)
            },
            error => alert(`Не удалось загрузить Items!`, error)
        )
        .catch(error => alert(`Не удалось загрузить Items!!`, error))
        
        getStructure(token, "5233") // e3c72c95-9fdc-11e1-8863-984be16c89d8 | 5233
            .then(
                data => {
                    setStructure(data)
                    setLoadingStructure(false)
                },
                error => alert(`Не удалось загрузить Structure!`, error)
            )
            .catch(error => alert(`Не удалось загрузить Structure!!`, error))
    },[])

    return (
    <InfoWidePage
        className="UpdateProductsPage"
    >
        <h1>Страница добавления товаров</h1>
        <br />
        <br />
        {loadingItems
        ? <Loading />
        : <>
            {items.map((item, idx) => {
                return <div key={idx+"_items"}>
                    <div>
                        id: {item.id}&nbsp;<br />
                        name: {item.name}&nbsp;<br />
                        guid: {item.guid}&nbsp;<br />
                        parentguid: {item.parentguid}&nbsp;<br />
                        artikul: {item.artikul}&nbsp;<br />
                        category: {item.category}&nbsp;<br />
                        TNVED: {item.TNVED}&nbsp;<br />
                        sertRequired: {item.sertRequired}&nbsp;<br />
                        volumeNumerator: {item.volumeNumerator}&nbsp;<br />
                        volumeDenominator: {item.volumeDenominator}&nbsp;<br />
                        weightNumerator: {item.weightNumerator}&nbsp;<br />
                        weightDenominator: {item.weightDenominator}&nbsp;<br />
                        edIzm: {item.edIzm}&nbsp;<br />
                        volumeEdIzm: {item.volumeEdIzm}&nbsp;<br />
                        inPrice: {item.inPrice}&nbsp;<br />
                        barcode: {item.barcode}&nbsp;<br />
                    </div>
                    <br /><br />
                </div>
            })}
        </>
        }
        <br />
        {loadingStructure
        ? <Loading />
        : <>
            {structure.map((item, idx) => {
                return <div key={idx+"_structure"}>
                    <div>
                        id: {item.id}&nbsp;<br />
                        s_id: {item.s_id}&nbsp;<br />
                        p_id: {item.p_id}&nbsp;<br />
                        name: {item.name}&nbsp;<br />
                        site: {item.site}&nbsp;<br />
                    </div>
                    <br /><br />
                </div>
            })}
        </>
        }
        <br />
    </InfoWidePage>
    )
}

export default UpdateProductsPage
