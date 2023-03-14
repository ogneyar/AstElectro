
import { getOneBrand } from '../../../http/brandAPI'
import { fetchOneProduct } from '../../../http/productAPI'

export default async function getBrandName(cart) {

    let brand

    if ( ! cart[0].brand ) {
        let { brandId } = await fetchOneProduct(cart[0].id)
        let { name } = await getOneBrand(brandId)
        brand = name.toLowerCase()
    }else {
        brand = cart[0].brand.toLowerCase()
    }

    return brand
}