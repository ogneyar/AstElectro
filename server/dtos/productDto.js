
module.exports = class ProductDto {
    id
    name
    url
    price
    rating
    img
    have
    article
    promo
    country
    request

    brandId
    categoryId

    info
    size
    filter

    constructor(model) {
        if ( ! model ) throw "Model is undefined (ProductDto)"
        this.id = model.id || undefined
        this.name = model.name
        this.url = model.url
        this.price = model.price
        this.rating = model.rating || undefined
        this.img = model.img || model.files
        this.have = model.have
        this.article = model.article
        this.promo = model.promo
        this.country = model.country
        this.request = model.request

        this.brandId = model.brandId
        this.categoryId = model.categoryId

        this.info = model.info || undefined
        this.size = model.size || undefined
        this.filter = model.filter || undefined
    }
}
