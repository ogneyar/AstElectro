
export const sortNameUp = (array) => {
    let code = (a) => 10 > a 
        ? 4000 + +a 
        : a.charCodeAt(0)  < 1000
            ? a.charCodeAt(0) + 2000
            : a.charCodeAt(0)

    // сортировка по имени по возрастанию
    array.sort((a, b) => code(a.name[0]) - code(b.name[0]))

    // console.log("array[1].name[0]",array[1].name[0])
    // console.log("array[1].name[0].charCodeAt(0)",array[1].name[0].charCodeAt(0))

    return array

    // return [ 
    //     ...array.filter(i => i.price > 0 && i.request === 0), 
    //     // товары с нулевой ценой и с ценой  по запросу, в конец массива
    //     ...array.filter(i => i.price === 0 || i.request) 
    // ]
}