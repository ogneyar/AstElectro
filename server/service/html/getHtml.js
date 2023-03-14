
const axios = require('axios')

async function getHtml(url) {
    
    let response

    await axios.get(url)
        .then(res => response = res.data)
        
    
    if (!response) throw `Не сработал axios.get(${url})`
    
    return response
}

module.exports = getHtml