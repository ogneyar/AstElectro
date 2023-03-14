import axios from 'axios'
import { API_URL } from '../utils/consts'


const $host = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

const $authHost = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)


$authHost.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && error.config && !error.config?._isRetry) {
        originalRequest._isRetry = true;
        try {
            const {data} = await axios.get(`${API_URL}api/user/refresh`, {withCredentials: true})
            localStorage.setItem('token', data.token);
            return $authHost.request(originalRequest);
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error;
})

export {
    $host,
    $authHost
}