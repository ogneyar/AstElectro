
import React, { useEffect, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Context } from '../../..'
import './mix.css'

const MixAll = observer(() => {

    const { userStore, productStore } = useContext(Context)

    const [ value, setValue ] = useState(productStore.mixAll === false ? false : true)

    useEffect(() => {
    },[])

    const onChangeInput = () => {
        localStorage.setItem('mixAll', !value)
        setValue(!value)
        productStore.setMixAll(!value)
    }

    return (
        <div
            className='Mix'
            style={userStore.user.id!==1 ? {display:"none",visible:"hidden"} : {}}
            onClick={onChangeInput}
        >
            MixAll&nbsp;

            <input 
                type="checkbox" 
                checked={value} 
                onChange={onChangeInput}
                onClick={() => {}} 
            />
        </div>
    )
})

export default MixAll
