
const createCategory = require("../../category/createCategory")
const translit = require("../../translit")


async function createCategoriesForTor(array) {
    let response
        
    array = array.map(i => {
        return {
            name: i["Название"]._text,
            code: i["Код"]._text,
            parentCode: i["КодРодителя"]._text,
            // description: i["ОписаниеРаздела"]._text,
        }
    })

    let objectCode = undefined
    let objectId = 839
  
    // один раз для создания категорий необходимо разкомментировать
    response = await reCreate(objectCode, objectId, array)

    return array
}
    
module.exports = createCategoriesForTor


//
const reCreate = async (objectCode, objectId, array) => {
    let response, result

    result = array.filter(i => {
        if (i.parentCode === objectCode) return true
        return false
    })

    result.forEach(async (i) => {

        let sub_category_id = objectId
        let is_product = true

        array.forEach(j => {
            if (i.code === j.parentCode) is_product = false
        })
        let category = await createCategory(i.name, translit(i.name), is_product, sub_category_id, 839)
        // return i
        // return {...i, id: category.id}
        
        response = await reCreate(i.code, category.id, array)
    })

    return response

}