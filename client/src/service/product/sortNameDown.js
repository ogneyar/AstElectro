
export const sortNameDown = (array) => {
    let code = (a) => 10 > a 
        ? 4000 + +a 
        : a.charCodeAt(0)  < 1000
            ? a.charCodeAt(0) + 2000
            : a.charCodeAt(0)

    // сортировка по имени по убыванию
    array.sort((a, b) => code(b.name[0]) - code(a.name[0]))

    return array
}