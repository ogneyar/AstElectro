import {makeAutoObservable} from 'mobx'

export default class CategoryStore {
    constructor() {
        this._categories = []
        this._allCategories = []
        this._selectedCategory = {}
        this._loading = false
        makeAutoObservable(this)
    }

    setCategories(categories) {
        this._categories = categories
    }
    setAllCategories(categories) {
        this._allCategories = categories
    }
    setSelectedCategory(category) {
        this._selectedCategory = category
    }
    setLoading(loading) {
        this._loading = loading
    }

    get categories() {
        return this._categories
    }
    get allCategories() {
        return this._allCategories
    }
    get selectedCategory() {
        return this._selectedCategory
    }
    get loading() {
        return this._loading
    }
}