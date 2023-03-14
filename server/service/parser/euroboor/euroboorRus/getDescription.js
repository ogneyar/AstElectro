
const parseHtml = require('../../../html/parseHtml')


async function getDescription(html) {
    
    let response

    response = parseHtml(html, {
        entry: `itemprop="description">`,
        start: `<ul>`,
        end: `</ul>`,
        inclusive: false
    }).replace(/;/g, ".").replace(/(li)/g, "p")
    
    return response
}

module.exports = getDescription