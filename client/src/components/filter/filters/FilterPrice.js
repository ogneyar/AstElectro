
import React, { useState, useEffect, useContext } from 'react'
// import { observable } from 'mobx'

import PopUp from '../../myBootstrap/popup/PopUp'

import { Context } from '../../..'
import './FilterPrice.css'


const FilterPrice = () => {

    const { productStore } = useContext(Context)

    const [ visibleMenu, setVisibleMenu ] = useState(false)
    const [ from, setFrom ] = useState([])
    const [ before, setBefore ] = useState([])
    const [ fromInput, setFromInput ] = useState(/*productStore?.filter?.price ? productStore.filter.price[0] :*/ 0)
    const [ beforeInput, setBeforeInput ] = useState(/*productStore?.filter?.price ? productStore.filter.price[1] :*/ 10000000)
    const [ fromMsk ] = useState([ 0, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000, 25000, 50000, 75000, 100000, 250000, 500000, 750000, 1000000 ])
    const [ beforeMsk ] = useState([ 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000, 25000, 50000, 75000, 100000, 250000, 500000, 750000, 1000000, 10000000 ])
    
    useEffect(() => {
        if (productStore.filter && productStore.filter?.price) {
            setFromInput(productStore.filter.price[0])
            setBeforeInput(productStore.filter.price[1])
        }
    }, [productStore.filter]) 

    useEffect(() => {
        let arrayFrom = []
        let arrayBefore  = []
        for(let i = 0; i < 18; i++) {
            arrayFrom.push("-")
            arrayBefore.push("-")
        }
        fromMsk.forEach((i,idx) => {
            if (fromInput === i) arrayFrom[idx] = " | "
        })
        beforeMsk.forEach((i,idx) => {
            if (beforeInput === i) arrayBefore[idx] = " | "
        })
        setFrom(arrayFrom)
        setBefore(arrayBefore)
    }, [fromInput, beforeInput, beforeMsk, fromMsk])
    
    const onClickFromSpan = (event, index) => {
        event.preventDefault()
        event.stopPropagation()

        setFromInput(fromMsk[index])
    }

    const onClickBeforeSpan = (event, index) => {
        event.preventDefault()
        event.stopPropagation()

        setBeforeInput(beforeMsk[index])
    }

    const onClickButtonHead = (event) => {
        if (event) {
            event.preventDefault()
            event.stopPropagation()
        }
        setVisibleMenu(false)
        productStore.setFilter({
            ...productStore.filter,
            price: [fromInput,beforeInput]
        })
    }
    

    return (
        <div 
            className="FilterPrice"
        >
            <PopUp
                name="Фильтровать"
                visible={visibleMenu}
                setVisible={setVisibleMenu}
            >
                <div className="FilterPrice_div_span_head">
                    <span>По цене</span>
                    <button
                    onClick={e => onClickButtonHead()}
                    >
                        Применить
                    </button>
                </div>
                {/* <br /> */}
                <div className="FilterPrice_div_span_from_before">
                    <span className="FilterPrice_span_from">
                        от {fromInput}
                    </span>
                    <span className="FilterPrice_span_before">
                        до {beforeInput}
                    </span>
                </div>
                {/* <br /> */}
                <div
                    className="FilterPrice_div"
                >
                    <span 
                        className="FilterPrice_span"
                        id="FilterPrice_span_from"
                    >
                        <i>
                        {from.map((i,idx) => {
                            if (fromMsk[idx] > beforeInput) {
                                return <span
                                    key={"from_" + idx + 1}
                                    style={{color:"grey"}}
                                    title={fromMsk[idx]}
                                >
                                    {i}
                                </span>
                            }
                            return <span
                                key={"from_" + idx + 1}
                                onClick={e => onClickFromSpan(e, idx)}
                                title={fromMsk[idx]}
                            >
                                {i}
                            </span>
                        })}
                        </i>
                    </span>
                    <span 
                        className="FilterPrice_span"
                        id="FilterPrice_span_before"
                    >
                        <i>
                        {before.map((i,idx) => {
                            if (beforeMsk[idx] < fromInput) {
                                return <span
                                    key={"before_" + idx + 1}
                                    style={{color:"grey"}}
                                    title={beforeMsk[idx]}
                                >
                                    {i}
                                </span>
                            }
                            return <span
                                key={"before_" + idx + 1}
                                onClick={e => onClickBeforeSpan(e, idx)}
                                title={beforeMsk[idx]}
                            >
                                {i}
                            </span>
                        })}
                        </i>
                    </span>
                </div>
            </PopUp>
        </div>
    )
}

export default FilterPrice
// export default observable(FilterPrice)