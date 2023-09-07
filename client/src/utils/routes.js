
import AdminPage from '../pages/admin/AdminPage'
import ParserPage from '../pages/parser/ParserPage'
import TesterPage from '../pages/tester/TesterPage'

import LoginPage from '../pages/login/LoginPage'
import ExitPage from '../pages/admin/ExitPage'
import RegistrationPage from '../pages/registration/RegistrationPage'
import LkPage from '../pages/lk/LkPage'
import ShopPage from '../pages/shop/ShopPage'
import ProductPage from '../pages/product/ProductPage'
import SearchPage from '../pages/search/SearchPage'
import ErrorPage from '../pages/error/ErrorPage'

import AboutUs from '../pages/info/AboutUs'
import DrivingDirections from '../pages/info/DrivingDirections'
import CompanyDetails from '../pages/info/CompanyDetails'
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
    PRODUCT_ROUTE, SEARCH_ROUTE, ERROR_ROUTE, ABOUT_US_ROUTE, REGISTRATION_ROUTE,
    DELIVERY_ROUTE, PRIVACY_POLICY_ROUTE, RETURNS_POLICY_ROUTE, LK_ROUTE,
    TERMS_OF_USE_ROUTE, WARRANTY_ROUTE, DELETE_ROUTE, UPDATE_PRODUCTS_ROUTE, 
    UPDATE_PRICES_ROUTE, DRIVING_DIRECTIONS_ROUTE, COMPANY_DETAILS_ROUTE,
    EXIT_ROUTE
} from './consts'

// brandRoutes находится в src/components/AppRouter.js

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        component: AdminPage,
        name: ""
    },
    {
        path: PARSER_ROUTE,
        component: ParserPage,
        name: ""
    },
    {
        path: TESTER_ROUTE,
        component: TesterPage,
        name: ""
    }
]

export const publicRoutes = [
    {
        path: MAIN_ROUTE, // - "/"
        // component: MainPage
        component: ShopPage,
        name: ""
    },
    {
        path: SHOP_ROUTE,
        component: ShopPage,
        name: ""
    },
    {
        path: LOGIN_ROUTE,
        component: LoginPage,
        name: ""
    },
    {
        path: EXIT_ROUTE,
        component: ExitPage,
        name: ""
    },
    {
        path: REGISTRATION_ROUTE,
        component: RegistrationPage,
        name: ""
    },
    {
        path: LK_ROUTE,
        component: LkPage,
        name: ""
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        component: ProductPage,
        name: ""
    },
    {
        path: SEARCH_ROUTE, // поиск
        component: SearchPage,
        name: ""
    },
    {
        path: ERROR_ROUTE, // ошибка
        component: ErrorPage,
        status: 404,
        name: ""
    },
    
    // отдел Информация
    {
        path: ABOUT_US_ROUTE, // о нас
        component: AboutUs,
        name: "О компании"
    },
    {
        path: DRIVING_DIRECTIONS_ROUTE, // схема проезда
        component: DrivingDirections,
        name: ""
    },
    {
        path: COMPANY_DETAILS_ROUTE, // реквизиты компании
        component: CompanyDetails,
        name: "Реквизиты компании"
    },
    {
        path: DELIVERY_ROUTE, // о доставке
        component: Delivery,
        name: ""
    },
    {
        path: PRIVACY_POLICY_ROUTE, // политика конфиденциальности
        component: PrivacyPolicy,
        name: ""
    },
    {
        path: RETURNS_POLICY_ROUTE, // условия возврата
        component: ReturnsPolicy,
        name: ""
    },
    {
        path: TERMS_OF_USE_ROUTE, // пользовательское соглашение
        component: TermsOfUse,
        name: ""
    },
    {
        path: WARRANTY_ROUTE, // о гарантии
        component: Warranty,
        name: ""
    },
    
    // обновление данных
    {
        path: UPDATE_PRODUCTS_ROUTE,
        component: UpdateProductsPage,
        name: ""
    },
    {
        path: UPDATE_PRICES_ROUTE,
        component: UpdatePricesPage,
        name: ""
    },

     // юмор It отдела
    {
        path: DELETE_ROUTE, // удаление сайта
        component: DeletePage,
        name: ""
    }
]
