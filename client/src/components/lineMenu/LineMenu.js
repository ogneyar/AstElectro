
import React from 'react'

import Limit from '../filter/limit/Limit'
import Sort from '../filter/sort/Sort'
import FilterPrice from '../filter/filters/FilterPrice'
// import NoImages from '../filter/noImages/NoImages'
// import MixAll from '../filter/mix/MixAll'

import './LineMenu.css'


const LineMenu = () => {


    // if (true) return 

    return (
        <div
            className="LineMenu"
        >
            <div
                className="LineMenu_box"
            >
                <div
                    className="LineMenu_body"
                >
                    <Limit />
                    <Sort />
                    <FilterPrice />
                    {/* <NoImages /> */}
                    {/* <MixAll /> */}
                </div>
            </div>
        </div>
    )
}

export default LineMenu