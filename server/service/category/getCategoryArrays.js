
const Category = require("../../models/Category")


// функция возвращает массив подкатегорий выбранной категории (categoryUrl)
const getCategoryArrays = async (categoryUrl) => {

    let arraySelectedCategory = []

    let category = await Category.findOne({
        where: {
            url: categoryUrl
        }
    })

    if ( ! category ) throw "Категория не найдена!"
    
    let arrayAllCategories =  await Category.findAll()
    
    const filterSubCategory = (id) => { // функция фильтрует из store все категории, которые не подходят для подкатегории id
        return arrayAllCategories.filter(i => i.sub_category_id === id) // и возвращает новый массив категорий
    }
    const filterIsProduct = (array) => { // функция удаляет категории в которых нет товаров
        let arr = array.filter(i => i.is_product)
        return arr.map(i => i.id)
    }
    const reArray = (array) => { // рекурсивная функция принимает массив и возвращает увеличеный массив категорий
        let newArray = array
        array.forEach(i => {
            let arr = filterSubCategory(i.id) // функция фильтрует все категории
            newArray = [...newArray, ...arr] // наращивается массив
            newArray = [...newArray, ...reArray(arr)] // функция вызывает саму себя и наращивает массив
        })
        return newArray
    }
    
    if (category.is_product) { // если выбранная категория содержит товар 
        arraySelectedCategory.push(category.id)
    }else {
        let array = filterSubCategory(category.id) // удаляем все категории, которые не подходят для подкатегории id
        arraySelectedCategory = filterIsProduct( // удаляем категории в которых нет товаров - !is_product
            reArray(array) // наращиваем массив рекурсивной функцией
        )
    }

    return [...new Set(arraySelectedCategory)] // new Set - исключаем повторяющиеся значения
}

module.exports = getCategoryArrays