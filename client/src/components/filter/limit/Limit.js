import React, { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { LIMIT } from '../../../utils/consts'
import { Context } from '../../..'

import './Limit.css'


const Limit = observer(() => {

    const { userStore, productStore } = useContext(Context)

    let limit = localStorage.getItem('limit') || LIMIT
    const [state, setState] = useState(limit)
        
    useEffect(() => {
        if (productStore.limit && productStore.limit !== state) {
            setState(productStore.limit)
        }
    // eslint-disable-next-line
    }, [productStore.limit])

    const change = (e) => {
        //setState(e.target.value)
        localStorage.setItem('limit', e.target.value)

        productStore.setLimit(e.target.value)

        productStore.setPage(1)
    }

    return (
        <div
            className="Limit"
        >            
            Показать:&nbsp;

            <select 
                className="Limit_select"
                value={state} 
                onChange={e => change(e)}
            >
                {/* <option disabled>количество:</option> */}
                {userStore.user?.id === 1 
                ?
                <>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="50">50</option>
                    <option value="96">96</option>
                    <option value="100">100</option>
                </>
                : 
                <>
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="96">96</option>
                </>
                }
                
                
            </select>
        </div>
    )
})

export default Limit
