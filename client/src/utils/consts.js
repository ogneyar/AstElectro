
export const LIMIT = 12

export const MAIN_ROUTE = '/' // главная страница

export const ADMIN_ROUTE = '/admin' // администрация
export const LOGIN_ROUTE = '/login' // вход
export const REGISTRATION_ROUTE = '/registration' // регистрация

export const SHOP_ROUTE = '/shop' // магазин

export const CART_ROUTE = '/cart' // корзина
export const CREATE_ORDER_ROUTE = '/create_order' // оформление заказа
export const PRODUCT_ROUTE = '/product' // товар
export const LK_ROUTE = '/lk' // личный кабинет
export const FORGOT_PASSWORD_ROUTE = '/forgot_password' // забыл пароль
export const CHANGE_PASSWORD_ROUTE = '/change_password' // смена пароля
export const SEARCH_ROUTE = '/search' // поиск
export const PAYMENT_ORDER_ROUTE = '/payment_order' // страница оплаты заказа
export const PAY_ROUTE = '/pay' // страница с которой идёт редирект на платёжную страницу Альфа банка
export const SUCCESS_ROUTE = '/success' // успех
export const CONGRATULATION_ROUTE = '/congratulation' // поздравления в случае успешной оплаты
export const ERROR_ROUTE = '/error' // ошибка
export const PARSER_ROUTE = '/parser' // парсер HTML
export const TESTER_ROUTE = '/tester' // парсер HTML
export const CONFIRM_ROUTE = '/confirmation' // подтверждение почты пользователя
export const CONFIRM_AVAILABILITY_ROUTE = '/confirm_availability' // подтверждение наличия заказа
export const SUPPORT_ROUTE = '/support' // тех.поддержка
export const MESSAGE_ROUTE = '/message' // страница для сообщений

// отдел Информация
export const ABOUT_US_ROUTE = '/about_us' // о нас
export const DELIVERY_ROUTE = '/delivery' // информация о доставке
export const PAYMENT_ROUTE = '/payment' // информация об оплате
export const PRIVACY_POLICY_ROUTE = '/privacy_policy' // политика конфиденциальности
export const RETURNS_POLICY_ROUTE = '/returns_policy' // условия возврата
export const TERMS_OF_USE_ROUTE = '/terms_of_use' // пользовательское соглашение
export const WARRANTY_ROUTE = '/warranty' // гарантия и сервис
export const CONTACTS_ROUTE = '/contacts' // контакты
export const SPECIALS_ROUTE = '/specials' // акции
export const DEALER_ROUTE = '/dealers' // дилерам
export const NEWS_ROUTE = '/news' // новости

// страницы брендов (в порядке добавления продукции на сайт)
export const MILWAUKEE_ROUTE = '/milwaukee' // milwaukee brand
export const RGK_ROUTE = '/rgk' // РусГеоКом бренд
export const HUSQVARNA_ROUTE = '/husqvarna' // husqvarna brand
export const KVT_ROUTE = '/kvt' // КВТ бренд
export const GEDORE_ROUTE = '/gedore' // Gedore бренд
export const TMK_ROUTE = '/tmk' // TMK бренд
export const LEIDTOGI_ROUTE = '/leidtogi' // LeidTogi бренд
export const ADVANTA_ROUTE = '/advanta' // Advanta бренд
export const EUROBOOR_ROUTE = '/euroboor' // Euroboor бренд
export const TOR_ROUTE = '/tor' // Tor бренд
// Esab - не заводил
// AEG - в ручную заводил несколько штук
// Leon - в ручную заводил несколько штук 


// странный юмор программиста
export const DELETE_ROUTE = '/delete' // удаление сайта

const URL_PRODUCTION  = process.env.REACT_APP_URL_PRODUCTION || "https://leidtogi.ru/"
const URL_TEST  = process.env.REACT_APP_URL_TEST || "https://hutor.site/" 
const URL_DEVELOPMENT  = process.env.REACT_APP_URL_DEVELOPMENT || "http://localhost:3000/"

const API_URL_PRODUCTION = process.env.REACT_APP_API_URL_PRODUCTION || "https://server.leidtogi.ru/"
const API_URL_TEST = process.env.REACT_APP_API_URL_TEST || "https://server.hutor.site/"
const API_URL_DEVELOPMENT = process.env.REACT_APP_API_URL_DEVELOPMENT || "http://localhost:5000/"

export const URL = 
    process.env.REACT_APP_ENV === 'production' 
    ? window.location.hostname === "leidtogi.ru" || window.location.hostname === "www.leidtogi.ru"
        ? URL_PRODUCTION 
        : URL_TEST
    : URL_DEVELOPMENT

export const API_URL = 
    process.env.REACT_APP_ENV === 'production' 
    ? window.location.hostname === "leidtogi.ru" || window.location.hostname === "www.leidtogi.ru"
        ? API_URL_PRODUCTION
        : API_URL_TEST
    : API_URL_DEVELOPMENT
        

// прокрутка страницы при нажатии на категорию
export const SCROLL_TOP = 200 // до aside
export const SCROLL_TOP_MOBILE = 180 // для мобильной версии сайта


export const NAME = `ООО "ЛЕИДТОГИ"` // название фирмы
export const CITY = "г. Курск" // город нахождения офиса
export const ADDRESS = "г.Курск, ул.Соловьиная, д.51, оф.25" // адресс нахождения офиса
export const ADDRESS_FULL = "305044, г.Курск, ул.Соловьиная, д.51, оф.25" // адресс нахождения офиса
export const PHONE_ONE = `<a href="tel:+74993021713">+7 (499) 302-17-13</a>` // городской телефон
export const PHONE_TWO = `<a href="tel:+79312607792">+7 (931) 260-77-92</a>` // Санин телефон
export const MAIL = `<a href="mailto:info@leidtogi.ru">info@leidtogi.ru</a>` // основной почтовый ящик
export const TIME_TO_WORK = `<div><p>пн - пт: 09:00 - 18:00</p><p>сб - вс: выходной</p></div>` // время работы


// индекс, от куда идёт доставка товаров
export const DELIVERY_INDEX_FROM = 140055 // - г. Котельники // 101000 - г. Москва // 305044 - г. Курск

// надбавка в % на расчёт доставки (если не нужна надбавка, поставь 1)
export const DELIVERY_EXTRA_CHARGE = 1.3 // 30%

// стоимость доставки курьером по г. Москва 
export const DELIVERY_BOXBERRY_CURIER_PRICE = 250 // в рублях

// необходимы в файле service/delivery/dl/getDerivalCity.js
export const DELIVERY_DL_DERIVAL_CITY_LEIDTOGI = "5000002804500000000000000"      // LeidTogi скопировал с Gedore 
export const DELIVERY_DL_DERIVAL_CITY_MILWAUKEE = "5000003200000000000000000"   // Milwaukee    - г. Котельники
export const DELIVERY_DL_DERIVAL_CITY_HUSQVARNA = "5000003000000000000000000"   // Husqvarna    - г. Химки
export const DELIVERY_DL_DERIVAL_CITY_GEDORE = "5000002804500000000000000"      // Gedore       - г. Москва, 2-й Лихачевский переулок, д. 7
export const DELIVERY_DL_DERIVAL_CITY_EVROBOOR = "5000002804500000000000000"      // Evroboor скопировал с Gedore
export const DELIVERY_DL_DERIVAL_CITY_RGK = "5000006619300000000000000"         // RGK          - г. Москва, ул. Коминтерна, д. 7, кор. 2
export const DELIVERY_DL_DERIVAL_CITY_KVT = "4000000100000000000000000"         // KVT          - г. Калуга, ул. 1я Академическая, д. 27
export const DELIVERY_DL_DERIVAL_CITY_TMK = "5000002804500000000000000"      // TMK скопировал с Gedore 
export const DELIVERY_DL_DERIVAL_CITY_ADVANTA = "5000002804500000000000000"      // Advanta-M скопировал с Gedore 
export const DELIVERY_DL_DERIVAL_CITY_TOR = "5000002804500000000000000"      // TOR скопировал с Gedore 
export const DELIVERY_DL_DERIVAL_CITY_KRAUSE = "5000002804500000000000000"      // Krause скопировал с Gedore 
export const DELIVERY_DL_DERIVAL_CITY_KEDR = "5000002804500000000000000"      // Kedr скопировал с Gedore 
export const DELIVERY_DL_DERIVAL_CITY_BYCON = "5000002804500000000000000"      // Bycon скопировал с Gedore 
export const DELIVERY_DL_DERIVAL_CITY_GEFEST = "5000002804500000000000000"      // Gefest скопировал с Gedore 


// телеграм
export const TELEGRAM_CHAT_ID_ADMIN = 1038937592 // 


// Яндекс.Метрика
export const PURCHASE_GOAL_ID = 226560302 // номер цели "успешная оплата"



export const PRICE_SEPARATOR = " " // разделитель тысячных значений цены (пример: 1 345 678)