
import AdminPage from '../pages/admin/AdminPage'
import ParserPage from '../pages/parser/ParserPage'
import TesterPage from '../pages/tester/TesterPage'

import LoginPage from '../pages/login/LoginPage'
import ShopPage from '../pages/shop/ShopPage'
import ProductPage from '../pages/product/ProductPage'
import SearchPage from '../pages/search/SearchPage'
import ErrorPage from '../pages/error/ErrorPage'

import AboutUs from '../pages/info/AboutUs'
import Delivery from '../pages/info/Delivery'
import PrivacyPolicy from '../pages/info/PrivacyPolicy'
import ReturnsPolicy from '../pages/info/ReturnsPolicy'
import TermsOfUse from '../pages/info/TermsOfUse'
import Warranty from '../pages/info/Warranty'

import UpdateProductsPage from '../pages/updates/UpdateProductsPage'
import UpdatePricesPage from '../pages/updates/UpdatePricesPage'

import DeletePage from '../pages/site/DeletePage'

import {
    MAIN_ROUTE, ADMIN_ROUTE, PARSER_ROUTE, TESTER_ROUTE, SHOP_ROUTE, LOGIN_ROUTE,
    PRODUCT_ROUTE, SEARCH_ROUTE, ERROR_ROUTE, ABOUT_US_ROUTE, 
    DELIVERY_ROUTE, PRIVACY_POLICY_ROUTE, RETURNS_POLICY_ROUTE,
    TERMS_OF_USE_ROUTE, WARRANTY_ROUTE, DELETE_ROUTE, UPDATE_PRODUCTS_ROUTE, UPDATE_PRICES_ROUTE
} from './consts'

// brandRoutes находится в src/components/AppRouter.js

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        component: AdminPage
    },
    {
        path: PARSER_ROUTE,
        component: ParserPage
    },
    {
        path: TESTER_ROUTE,
        component: TesterPage
    }
]

export const publicRoutes = [
    {
        path: MAIN_ROUTE, // - "/"
        // component: MainPage
        component: ShopPage
    },
    {
        path: SHOP_ROUTE,
        component: ShopPage
    },
    {
        path: LOGIN_ROUTE,
        component: LoginPage
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        component: ProductPage
    },
    {
        path: SEARCH_ROUTE, // поиск
        component: SearchPage
    },
    {
        path: ERROR_ROUTE, // ошибка
        component: ErrorPage,
        status: 404
    },
    
    // отдел Информация
    {
        path: ABOUT_US_ROUTE, // о нас
        component: AboutUs
    },
    {
        path: DELIVERY_ROUTE, // о доставке
        component: Delivery
    },
    {
        path: PRIVACY_POLICY_ROUTE, // политика конфиденциальности
        component: PrivacyPolicy
    },
    {
        path: RETURNS_POLICY_ROUTE, // условия возврата
        component: ReturnsPolicy
    },
    {
        path: TERMS_OF_USE_ROUTE, // пользовательское соглашение
        component: TermsOfUse
    },
    {
        path: WARRANTY_ROUTE, // о гарантии
        component: Warranty
    },
    
    // обновление данных
    {
        path: UPDATE_PRODUCTS_ROUTE,
        component: UpdateProductsPage
    },
    {
        path: UPDATE_PRICES_ROUTE,
        component: UpdatePricesPage
    },

     // юмор It отдела
    {
        path: DELETE_ROUTE, // удаление сайта
        component: DeletePage 
    }
]
