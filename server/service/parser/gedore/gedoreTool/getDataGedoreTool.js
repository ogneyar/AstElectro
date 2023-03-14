
const axios = require("axios")
const getUrlGedoreTool = require("./getUrlGedoreTool")


async function getDataGedoreTool(article) {
    
    let response
    
    let url = await getUrlGedoreTool(article)

    await axios.get(url).then(res => response = res.data)
        
    if (!response) throw `Не сработал axios.get(${url})`
        
    return response
}

module.exports = getDataGedoreTool