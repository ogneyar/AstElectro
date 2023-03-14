import React from 'react'

import Limit from './limit/Limit'
import MixPromo from './mix/MixPromo'
import MixAll from './mix/MixAll'
import NoImages from './noImages/NoImages'
// import Sort from './sort/Sort'
// import LineMenu from '../lineMenu/LineMenu' 
// import FilterPrice from './filters/FilterPrice'

import './Filter.css'


const Filter = () => {
    return (
        <div
            className="Filter"
        >
            <div
                className="Filter_LineMenu"
            >
                {/* Боковое меню */}
                {/* <LineMenu /> */}
            </div>

            <div
                className="Filter_Menu"
            >
                {/* для админа */}
                <NoImages />
                <MixAll />
                <MixPromo />                
                {/* для пользователя */}
                {/* <FilterPrice /> */}
                {/* <Sort /> */}
                <Limit />
            </div>
        </div>
    )
}

export default Filter
