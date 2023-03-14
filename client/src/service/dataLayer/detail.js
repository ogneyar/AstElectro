
export default function detail(args) {
    window.dataLayer.push({ // Яндекс.Метрика
        "ecommerce": {
            "currencyCode": "RUB",
            "detail": {
                "products": [
                    {
                        "id": args?.article,
                        "name" :  args?.name,
                        "price":  args?.price,
                        // "brand": args?.brand,
                        // "category": args?.category,
                        // "variant" : args?.variant
                    }
                ]
            }
        }
    });
}