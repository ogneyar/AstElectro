
import { runInAction, makeAutoObservable } from 'mobx' 


class BrandStore {
    constructor() {
        this._brands = []
        this._selectedBrand = {}
        makeAutoObservable(this)
    }

    setBrands(brands) {
        this._brands = brands
    }
    setSelectedBrand(brand) {
        runInAction(() => {
            this._selectedBrand = brand
        })
    }

    get brands() {
        return this._brands
    }
    get selectedBrand() {
        return this._selectedBrand
    }
}

export default BrandStore