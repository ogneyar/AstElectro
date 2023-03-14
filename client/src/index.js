
import React, { createContext } from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import UserStore from './store/UserStore'
import ProductStore from './store/ProductStore'
import CategoryStore from './store/CategoryStore'
import BrandStore from './store/BrandStore'
import RatingStore from './store/RatingStore'
import BreadCrumbsStore from './store/BreadCrumbsStore'
import CartStore from './store/CartStore'
import './styles/index.css'

export const Context = createContext(null)

let contextValue = {
    userStore: new UserStore(),
    productStore: new ProductStore(),
    categoryStore: new CategoryStore(),
    brandStore: new BrandStore(),
    ratingStore: new RatingStore(),
    breadStore: new BreadCrumbsStore(),
    cartStore: new CartStore()
}

let jsx = (
    <Context.Provider value={contextValue}>
        <App />
    </Context.Provider>
)

ReactDOM.render(jsx, document.getElementById('root'))
