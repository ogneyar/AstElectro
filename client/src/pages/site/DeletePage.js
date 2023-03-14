import React from 'react'
import { useHistory } from 'react-router-dom'

import './DeletePage.css'


const Delete = () => {

    let history = useHistory()
    history.block()
    // history.replace("specials")
    // history.goBack()
    // history.push("/")

    // console.log(history.location)
    // history.location.pathname = "ggg"

    return (
        <div
            className="Delete"
        >
           <p>
                Сайт удалён!
            </p>
        </div>
    )
}

export default Delete
