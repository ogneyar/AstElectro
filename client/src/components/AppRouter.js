
import React, { useState, useContext, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { authRoutes, publicRoutes } from '../utils/routes'
import ShopPage from '../pages/shop/ShopPage'
import BrandPage from '../pages/brand/BrandPage'
import { ERROR_ROUTE } from '../utils/consts'
import Loading from './Loading'

import { Context } from '..'


const AppRouter = observer(() => {
    
    const { userStore, brandStore } = useContext(Context)

    const [ brandRoutes, setBrandRoutes ] = useState([])

    
    useEffect(() => {
        setBrandRoutes(brandStore.brands.map(i => {
            let brandName = i?.name.toLowerCase()
            return {
                path: '/' + brandName,
                component: BrandPage//({ brandName })
            }
        }))
    }, [brandStore.brands])


    // ожидание загрузки роутов брендов (Этот лоадинг на оранжевом фоне)
    if (brandRoutes[0]?.path === undefined) return <Loading />


    return (
        <Switch>
            {/* роуты зарегистрированных пользователей */}
            {userStore.isAuth && authRoutes.map(({ path, component, status }) => 
                <Route key={path} path={path} component={component} status={status || 200} exact />
            )}

            {/* общедоступные роуты */}
            {publicRoutes.map(({ path, component, status }) => 
                <Route key={path} path={path} component={component} status={status || 200} exact />
            )}

            {/* роуты брендов - /nazvanie-brenda */}
            {brandRoutes.map(({ path, component, status }) => 
                <Route key={path} path={path} component={component} status={status || 200} exact />
            )}

            {/* роуты товаров, начинаются с имени бренда - /nazvanie-brenda/nazvanie-tovara */}
            {brandRoutes.map(({ path, component, status }) => 
                <Route key={path + '/:url'} path={path + '/:url'} component={component} status={status || 200} />
            )}

            {/* роут категорий - /nazvanie-kategorii */}
            <Route key={'/:name'} path={'/:name'} component={ShopPage} status={200} exact />

            {/* <Redirect to={SHOP_ROUTE} />  */}
            <Redirect to={ERROR_ROUTE} /> 
        </Switch>
    )
})

export default AppRouter
