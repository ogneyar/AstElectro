
import React, { useEffect, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Context } from '../../..'
import './mix.css'

const MixPromo = observer(() => {

    const { userStore, productStore } = useContext(Context)

    const [ value, setValue ] = useState(productStore.mixPromo === false ? false : true)

    useEffect(() => {
    },[])

    const onChangeInput = () => {
        localStorage.setItem('mixPromo', !value)
        setValue(!value)
        productStore.setMixPromo(!value)
    }

    return (
        <div
            className='Mix'
            style={userStore.user.id!==1 ? {display:"none",visible:"hidden"} : {}}
            onClick={onChangeInput}
        >
            MixPromo&nbsp;

            <input 
                type="checkbox" 
                checked={value} 
                onChange={onChangeInput}
                onClick={() => {}} 
            />
        </div>
    )
})

export default MixPromo
