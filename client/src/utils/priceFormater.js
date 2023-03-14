import { PRICE_SEPARATOR } from "./consts"

export default function priceFormater(productPrice){
    if (productPrice > 0) {
        let price = Math.round(productPrice * 100) // переводим цену из рублей в копейки (округление Math.round необходимо для того чтобы избавиться от багов)
        let priceLength = price.toString().length - 2 // длина цены минус копейки
        // если цена меньше 1000, то "разделитель" не нужен
        if (priceLength <= 3) return productPrice
        
        let quantity = priceLength / 3 // количество трёхзначных значений
        quantity = Math.floor(quantity) // отбросил остаток
        let remains = priceLength % 3 // остаток
        
        return productPrice
            .toString()
            .split("")
            .map((i, idx) => {
                if (remains === idx + 1) return i + PRICE_SEPARATOR
                if (quantity > 1 && remains + 3 === idx + 1) return i + PRICE_SEPARATOR
                if (quantity > 2 && remains + 6 === idx + 1) return i + PRICE_SEPARATOR
                if (quantity > 3 && remains + 9 === idx + 1) return i + PRICE_SEPARATOR
                return i
            })
            .join("")
    }else {
        return 0
    }
}