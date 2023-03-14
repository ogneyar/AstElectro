// import Notification from "../../components/myBootstrap/Notification"
import { fetchProductSizes } from "../../http/productAPI"
import { getOneBrand } from "../../http/brandAPI"


export const onClickButtonBuy = async (e, product, type = "add") => {
    e.stopPropagation()
    e.preventDefault()


    let size 

    let cart = localStorage.getItem('cart')
    if (cart) {
        cart = JSON.parse(cart)

        if (type === "add" || type === "remove" || type === "change") {
            let yes 
            cart = cart.map(i => {
                if (i.id === product.id) {
                    yes = "yes"
                    let newValue = 0
                    if (type === "add") {newValue = Number(i.value) + 1}
                    if (type === "remove") {
                        if (i.value > 1) {
                            newValue = Number(i.value) - 1
                        }else {
                            newValue = Number(i.value)
                        }
                    }
                    if (type === "change") {newValue = Number(e.target.value)}
                    
                    return {
                        ...i, 
                        value: newValue, 
                        total: Math.round((Number(i.price) * newValue) * 100) / 100
                    }
                } else return i
            })
            if (!yes && type === "add") {
                size = await fetchProductSizes(product.id)
                cart = [...cart, {
                    id: product.id,
                    value: 1,
                    name: product.name,
                    article: product.article,
                    price: Number(product.price),
                    img: product.img[0].small,
                    total: Number(product.price),
                    size
                }]
            }
        }else if (type === "delete") {
            cart = cart.filter(i => {
                if (i.id !== product.id) return true
                return false
            })
        }
        
    }else {

        if (type === "add") {
            let brand = await getOneBrand(product.brandId)
            size = await fetchProductSizes(product.id)
            cart = [{
                id:product.id,
                value:1,
                name:product.name,
                article:product.article,
                price: Number(product.price),
                img:product.img[0].small,
                total: Number(product.price),
                size,
                brand: brand.name.toLowerCase()
            }]
        }

    }

    if (cart.length > 0) localStorage.setItem('cart', JSON.stringify(cart))
    else localStorage.removeItem('cart')


    return cart
}