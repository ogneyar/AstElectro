import React, { useState, useEffect } from 'react'

import './ContextMenu.css'


const ContextMenu = (props) => {

    const [ visible, setVisible ] = useState(false)
    const [ top, setTop ] = useState(null)
    const [ left, setLeft ] = useState(null)
    const [ className, setClassName ] = useState("")
    // const [ flag, setFlag ] = useState(false)

    // let className = "ContextMenu_buttons "
    // let top, left

    useEffect(() => {
        if (props?.visible && props.visible?.event) {
            setTop(props.visible.event.clientY)
            setLeft(props.visible.event.clientX)
            // console.log(props?.visible)
            if (!visible) setVisible(true)
        }
    
        if (props?.className) {
            setClassName(props?.className)
        }
    // eslint-disable-next-line
    }, [props?.className, props?.visible])
    
    const onMenuClick = (e) => {
        // setFlag(true)
        e.preventDefault()
        // console.log("uhjkhukj");
        setVisible(false)
    }

    window.addEventListener('scroll', () => {
        setVisible(false)
    })

    return (
        <div
            className={visible ? "ContextMenu" : ""}
            // className={"ContextMenu ContextMenu_visible"}
            
            onContextMenu={e => onMenuClick(e)}
            onClick={e => onMenuClick(e)}
        >
            <div
                className={visible ? "ContextMenu_mainBox" : ""}
                style={(top && left) && {top, left}}
            >
                <div 
                    {...props}
                    className={visible ? "ContextMenu_buttons " + className : ""}
                >

                    {visible ? props?.children : ""}

                </div>
            </div>
        </div>
    )
}

export default ContextMenu