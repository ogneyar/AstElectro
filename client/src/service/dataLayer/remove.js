
export default function remove(args) {
    window.dataLayer.push({ // Яндекс.Метрика
        "ecommerce": {
            "currencyCode": "RUB",
            "remove": {
                "products": [
                    {
                        "id": args?.article,
                        "name": args?.name,
                        "price": args?.price,
                        // "brand": args?.brand,
                        // "category": args?.category,
                        "quantity": args?.value
                    }
                ]
            }
        }
    });
}