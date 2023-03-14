
export const sortPriceDown = (array) => {
    // сортировка по цене по убыванию
    array.sort((a, b) => b.price - a.price)

    return [ 
        ...array.filter(i => i.price > 0 && i.request === 0), 
        // товары с нулевой ценой и с ценой  по запросу, в конец массива
        ...array.filter(i => i.price === 0 || i.request) 
    ]
}