import { PURCHASE_GOAL_ID } from "../../utils/consts";

export default function purchase(id, cart) {
    let products = cart.map(i => {
        return {
            id: i?.itemCode, // артикул
            name: i?.name, // наименование
            price: Number(i?.itemPrice) / 100, // цена за штуку в рублях
            // brand: i?.brand,
            // category: i?.category,
            quantity: i?.quantity?.value // количество
        }
    })
    window.dataLayer.push({
        "ecommerce": {
            "currencyCode": "RUB",
            "purchase": {
                "actionField": {
                    "id" : id,
                    goal_id: PURCHASE_GOAL_ID
                },
                "products": products
            }
        }
    });
}