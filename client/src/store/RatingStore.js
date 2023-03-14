import {makeAutoObservable} from 'mobx'

export default class RatingStore {
    constructor() {
        this._rate = []
        makeAutoObservable(this)
    }

    setRate(rate) {
        this._rate = rate
    }

    get rate() {
        return this._rate
    }
}