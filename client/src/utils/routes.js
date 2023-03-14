// eslint-disable-next-line
// import MainPage from '../pages/main/MainPage'

import AdminPage from '../pages/admin/AdminPage'
import ParserPage from '../pages/parser/ParserPage'
import TesterPage from '../pages/tester/TesterPage'
import LkPage from '../pages/lk/LkPage'
import DealerPage from '../pages/dealer/DealerPage' 

import LoginPage from '../pages/login/LoginPage'
import RegistrationPage from '../pages/registration/RegistrationPage'
import ConfirmPage from '../pages/confirm/ConfirmPage'
import ConfirmAvailabilityPage from '../pages/confirm/ConfirmAvailabilityPage'
import ForgotPasswordPage from '../pages/password/ForgotPasswordPage'
import ChangePasswordPage from '../pages/password/ChangePasswordPage'
import ShopPage from '../pages/shop/ShopPage'
import ProductPage from '../pages/product/ProductPage'
import CartPage from '../pages/cart/CartPage'
import PaymentOrderPage from '../pages/pay/PaymentOrderPage' // страница оплаты заказа
import PayPage from '../pages/pay/PayPage' // redirect on bank
import CreateOrderPage from '../pages/createOrder/CreateOrderPage'
import SearchPage from '../pages/search/SearchPage'
import SuccessPage from '../pages/success/SuccessPage'
import CongratulationPage from '../pages/congratulation/CongratulationPage'
import ErrorPage from '../pages/error/ErrorPage'
import SupportPage from '../pages/support/SupportPage'
import MessagePage from '../pages/message/MessagePage'

import AboutUs from '../pages/info/AboutUs'
import Delivery from '../pages/info/Delivery'
import Payment from '../pages/info/Payment'
import PrivacyPolicy from '../pages/info/PrivacyPolicy'
import ReturnsPolicy from '../pages/info/ReturnsPolicy'
import TermsOfUse from '../pages/info/TermsOfUse'
import Warranty from '../pages/info/Warranty'
import Contacts from '../pages/info/Contacts'
import Specials from '../pages/info/Specials'
import NewsPage from '../pages/info/news/NewsPage'

import DeletePage from '../pages/site/DeletePage'

import {
    MAIN_ROUTE, ADMIN_ROUTE, PARSER_ROUTE, TESTER_ROUTE, CART_ROUTE, PAY_ROUTE, SHOP_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, 
    PRODUCT_ROUTE, LK_ROUTE, CONFIRM_ROUTE, SEARCH_ROUTE, SUCCESS_ROUTE, ERROR_ROUTE, ABOUT_US_ROUTE, 
    DELIVERY_ROUTE, PAYMENT_ROUTE, PRIVACY_POLICY_ROUTE, RETURNS_POLICY_ROUTE, CREATE_ORDER_ROUTE,
    TERMS_OF_USE_ROUTE, WARRANTY_ROUTE, CONTACTS_ROUTE, SPECIALS_ROUTE, DELETE_ROUTE, CONGRATULATION_ROUTE,
    SUPPORT_ROUTE, MESSAGE_ROUTE, FORGOT_PASSWORD_ROUTE, CHANGE_PASSWORD_ROUTE, CONFIRM_AVAILABILITY_ROUTE,
    PAYMENT_ORDER_ROUTE, DEALER_ROUTE, NEWS_ROUTE
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
        path: LK_ROUTE,
        component: LkPage
    },
    {
        path: FORGOT_PASSWORD_ROUTE,
        component: ForgotPasswordPage
    },
    {
        path: CHANGE_PASSWORD_ROUTE + '/:url',
        component: ChangePasswordPage
    },
    {
        path: CART_ROUTE,
        component: CartPage
    },
    {
        path: PAYMENT_ORDER_ROUTE,
        component: PaymentOrderPage
    },
    {
        path: PAY_ROUTE,
        component: PayPage
    },
    {
        path: CREATE_ORDER_ROUTE,
        component: CreateOrderPage
    },
    {
        path: LOGIN_ROUTE,
        component: LoginPage
    },
    {
        path: REGISTRATION_ROUTE,
        component: RegistrationPage
    },
    {
        path: CONFIRM_ROUTE + '/:url',
        component: ConfirmPage
    },
    {
        path: CONFIRM_AVAILABILITY_ROUTE, // ConfirmAvailability
        component: ConfirmAvailabilityPage
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
        path: SUPPORT_ROUTE, // тех. поддержка
        component: SupportPage
    },
    {
        path: MESSAGE_ROUTE, // 
        component: MessagePage
    },
    // {
    //     path: SUCCESS_ROUTE + '/:uuid/:id',
    //     component: SuccessPage
    // },
    {
        path: SUCCESS_ROUTE, // успешная оплата
        component: SuccessPage
    },
    {
        path: CONGRATULATION_ROUTE, // поздравления
        component: CongratulationPage
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
        path: PAYMENT_ROUTE, // об оплате
        component: Payment
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
    {
        path: CONTACTS_ROUTE, // контакты
        component: Contacts
    },
    {
        path: SPECIALS_ROUTE, // акции
        component: Specials
    },
    {
        path: DEALER_ROUTE, // дилерам (поставщикам)
        component: DealerPage
    },
    {
        path: NEWS_ROUTE, // новости
        component: NewsPage
    },

     // юмор It отдела
    {
        path: DELETE_ROUTE, // удаление сайта
        component: DeletePage 
    }
]
