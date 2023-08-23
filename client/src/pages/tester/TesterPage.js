
import React, { useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap'
import HtmlReactParser from 'html-react-parser'
import { useHistory } from 'react-router-dom'

import { setFeed, setSiteMap } from '../../http/testerAPI'
import { Alert } from '../../components/myBootstrap'
import Loading from '../../components/Loading'
import { API_URL, LOGIN_ROUTE, TESTER_ROUTE } from '../../utils/consts'
import InfoPage from '../info/InfoPage'
import scrollUp from '../../utils/scrollUp'

import { Context } from '../..'


const TesterPage = () => {
    
    const { productStore, userStore } = useContext(Context) 

    const history = useHistory()

    const [ showAlert, setShowAlert ] = useState(false)
    const [ message, setMessage ] = useState("")

    const [ xml, setXML ] = useState("")

    const [ map, setMap ] = useState("")

    const [ loading, setLoading ] = useState(false)


    useEffect(() => {
    }, [message])



    const getXML = async () => {
        if (productStore?.products) {
            setXML("...")

            let response = await setFeed()

            if (response?.error) setXML("ошибка")
            else setXML("успех")

        }else setXML("")
    }


    const getSiteMap = async () => {
        if (productStore?.products) {
            setMap("...")

            let response = await setSiteMap({
                routes: [
                    "/about-us/",
                    "/company-details/",
                ]
            })

            if (response?.error) setMap("ошибка")
            else setMap("успех")

        }else setMap("")
    }

    


    if (loading) return <Loading />

    
    if (!userStore.isAuth) {
        history.push(LOGIN_ROUTE + "?returnUrl=" + TESTER_ROUTE)
        scrollUp(scroll) 
    }

    return (
        <InfoPage>
            <div>
                
                {/* <div>
                    <br />
                    Создание фида yml для Яндекс.Метрики
                    <hr />
                    {xml && <> {xml} <br /> </>}
                    <Button onClick={getXML}> Создать фид </Button>
                    <hr />
                </div> */}
                
                <div>
                    <br />
                    Создание карты сайта (siteMap)
                    <hr />
                    {map && <> {map} <br /> </>}
                    <Button onClick={getSiteMap}> Создать siteMap </Button>
                    <hr />
                </div>
                

            </div>
            <Alert show={showAlert} onHide={() => setShowAlert(false)}>
                {/* {React.createElement(
                    "img", 
                    {src: `${message}`},
                    null
                )} */}
                {HtmlReactParser(message)}
            </Alert>
        </InfoPage>
    )
}

export default TesterPage
