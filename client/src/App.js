
import { useContext, useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { observer } from 'mobx-react-lite'

import AppRouter from './components/AppRouter'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { Alert } from './components/myBootstrap'
import { getUserInfo } from './http/userAPI'
import { fetchBrands } from './http/brandAPI'
import { echo } from './http/testerAPI'
import scrollUp from './utils/scrollUp'
import { Context } from '.'

import 'bootstrap/dist/css/bootstrap.css'
import './styles/App.css'


const App = observer(() => { 

    const { userStore, brandStore, cartStore } = useContext(Context)

    const [ alertVisible, setAlertVisible ] = useState(false)
    const [ messageAlert, setMessageAlert ] = useState("")

    const getError = (text, error) => {
        if (error && typeof(error) === "string") setMessageAlert(`${text} Error: ${error}`)
        else if (error && typeof(error) === "object") setMessageAlert(`${text} Error: ${JSON.stringify(error.message)}`)
        else setMessageAlert(text)
        setAlertVisible(true)
    }

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'production') {
            document.getElementById("repair").style.display = "flex"
        }
        echo()
			.then(data => {
				if (data?.ok !== true) 
                    getError(`Отсутствует связь с сервером!`)
			})
			.catch(() => getError(`Отсутствует связь с сервером!`))
    }, [])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getUserInfo()
                .then(
                    data => {
                        if (data?.id) {
                            userStore.setUser({ ...data, activationLink: null, password: null })
                            userStore.setIsAuth(true)
                        }else {
                            localStorage.removeItem('token')
                        }
                    },
                    error =>  getError(`Не удалось загрузить информацию о пользователях!`, error)
                )
                .catch(error => getError(`Не удалось загрузить данные о пользователях!`, error))
                .finally(() => userStore.setLoading(false))
        }else userStore.setLoading(false)
        
        fetchBrands()
            .then(
                data => {
                    // сохраняем бренды в сторе
                    brandStore.setBrands(data)
                    // brandStore.setSelectedBrand(data[0])
                },
                error => getError(`Не удалось загрузить бренды!`, error)
            )
            .catch(error => getError(`Не удалось загрузить данные о брендах!`, error))
               
        // scrollUp(0)
        
    }, [ brandStore, userStore, cartStore ])


    if (alertVisible) return <Alert show={alertVisible} onHide={() => setAlertVisible(false)} message={messageAlert} />


    return (
        <BrowserRouter>
            <QueryParamProvider adapter={ReactRouter5Adapter}>
                <Header />

                <AppRouter />

                <Footer />
            </QueryParamProvider>
        </BrowserRouter>
    )
})

export default App
