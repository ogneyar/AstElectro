import {makeAutoObservable} from 'mobx'

export default class UserStore {
    constructor() {
        // загрузка данных с сервера
        this._loading = true
        // авторизован ли
        this._isAuth = false
        // данные о пользователе
        this._user = {}
        makeAutoObservable(this)
    }

    setLoading(bool) {
        this._loading = bool
    }
    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }

    get loading() {
        return this._loading
    }
    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
}