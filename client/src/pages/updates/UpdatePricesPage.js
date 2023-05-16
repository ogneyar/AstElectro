
import { useQueryParam, StringParam } from 'use-query-params'
import { useHistory } from 'react-router-dom'

import InfoPage from '../info/InfoPage'
import { PARSER_ROUTE, SCROLL_TOP, SCROLL_TOP_MOBILE } from '../../utils/consts'
import InfoWidePage from '../info/InfoWidePage'

import './UpdatePricesPage.css'


const UpdatePricesPage = () => {

    const history = useHistory()

    const [ token ] = useQueryParam('token', StringParam)

    const onClickButtonBack = () => {
        history.push(PARSER_ROUTE)
        scrollUp(window.innerWidth < 991 ? SCROLL_TOP : SCROLL_TOP_MOBILE)
    }

    if (token !== process.env.REACT_APP_TOKEN_UPDATES) return <InfoPage>У Вас нет допуска к этой странице!</InfoPage>

    return (
    <InfoWidePage>
        <div
            className="UpdatePricesPage"
        >
            <div className="UpdatePricesPage_buttonBack">
                <button
                    onClick={onClickButtonBack}
                >
                    Назад
                </button>
            </div>
            <div>
                UpdatePricesPage 
            </div>
        </div>
    </InfoWidePage>
    )
}

export default UpdatePricesPage
