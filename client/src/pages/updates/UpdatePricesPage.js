
import { useQueryParam, StringParam } from 'use-query-params'
import InfoPage from '../info/InfoPage'


const UpdatePricesPage = () => {

    const [ token ] = useQueryParam('token', StringParam)

    if (token !== process.env.REACT_APP_TOKEN_UPDATES) return <InfoPage>У Вас нет допуска к этой странице!</InfoPage>

    return <InfoPage>
        UpdatePricesPage
    </InfoPage>
}

export default UpdatePricesPage
