
import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Context } from '../../..'
import './Sort.css'
import PopUp from '../../myBootstrap/popup/PopUp'

const Sort = observer(() => {
    
    const { productStore } = useContext(Context)

    const [ visibleMenu, setVisibleMenu ] = useState(false)

    const onClickSort = (action) => {
        setVisibleMenu(false)
        localStorage.setItem("sort", action)
        productStore.setSort(action)
        productStore.setPage(1)
    }


    return (
        <div
            className='Sort'
        >
            <PopUp
                name="Сортировать"
                visible={visibleMenu}
                setVisible={setVisibleMenu}
            >
                <div 
                    onClick={() => onClickSort("priceUp")}
                    className="Sort_Menu_div"
                >
                    По цене (по возрастанию)
                </div>
                <div 
                    onClick={() => onClickSort("priceDown")}
                    className="Sort_Menu_div"
                >
                    По цене (по убыванию)
                </div>
                <div 
                    onClick={() => onClickSort("nameUp")}
                    className="Sort_Menu_div"
                >
                    По алфавиту (по возрастанию)
                </div>
                <div 
                    onClick={() => onClickSort("nameDown")}
                    className="Sort_Menu_div"
                >
                    По алфавиту (по убыванию)
                </div>
            </PopUp>
        </div>
    )
})

export default Sort
