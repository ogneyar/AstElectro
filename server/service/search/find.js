
const { Product } = require('../../models/models')


const find = async (action, text) => {
    
    let products = await Product.findAll({
        where: { have: 1 }
    })

    let response = []

    switch(action) {
        case "value":
            response = findValues()
        break

        case "article":
            response = filterArticle()
            
            if (response[0] === undefined) {
                response = filterName()
            }
        break

        case "name":
            response = filterName()
            
            if (response[0] === undefined) {
                response = filterArticle()
            }
        break

        default:
        break
    }
    
    function findValues() {
        let answer = []

        let arrayTexts = text.toLowerCase().split(" ")
        arrayTexts.forEach(item => {
            let array = []
            array = products.filter(product => {
                if (product.article.toLowerCase().indexOf(item) !== -1) return true
                if (product.name.toLowerCase().indexOf(item) !== -1) return true
                return false
            })
            answer.push(...array)
        })
        
        return [...new Set(answer)]
    }
    
    function filterArticle() {
        return products.filter(product => {
            if (product.article.indexOf(text) !== -1) return true
            return false
        })
    }

    function filterName () {
        return products.filter(product => {
            if (product.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) return true
            return false
        })
    }

    return { count: response.length, rows: response }
}


module.exports = find