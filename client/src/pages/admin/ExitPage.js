
import { useContext, useEffect } from "react"
import { useHistory } from 'react-router-dom'

import { Container } from "../../components/myBootstrap"
import { logout } from "../../http/userAPI"
import { MAIN_ROUTE } from '../../utils/consts'
import scrollUp from "../../utils/scrollUp"

import { Context } from '../../'


const ExitPage = () => {
    
    const { userStore } = useContext(Context)

    const history = useHistory()

    useEffect(() => {        
        userStore.setUser({})
        userStore.setIsAuth(false)
        logout()
        history.push(MAIN_ROUTE)
        scrollUp(0) 
    },[])
    
    return (
        <Container>
            Exit
        </Container>
    )
}


export default ExitPage