import { makeAutoObservable } from 'mobx'

export default class BreadCrumbsStore {
    constructor() {
        this._crumbs = []
        makeAutoObservable(this)
    }

    setCrumbs(crumbs) {
        this._crumbs = crumbs
    }

    get crumbs() {
        return this._crumbs
    }
}