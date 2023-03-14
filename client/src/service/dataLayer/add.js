
export default function add(args) {
    window.dataLayer.push({ // Яндекс.Метрика
        "ecommerce": {
            "currencyCode": "RUB",
            "add": {
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