
export const sortPriceUp = (array) => {
    // сортировка по цене по возрастанию
    array.sort((a, b) => a.price - b.price)

    return [ 
        ...array.filter(i => i.price > 0 && i.request === 0), 
        // товары с нулевой ценой и с ценой  по запросу, в конец массива
        ...array.filter(i => i.price === 0 || i.request) 
    ]
}