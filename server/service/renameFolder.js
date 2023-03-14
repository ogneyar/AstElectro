const path = require('path')
const fs = require('fs')

const deleteOldFiles = require('./deleteOldFiles')


module.exports = function (brand, article, newArticle) {

    if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand, newArticle))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, newArticle))
        }catch(e) {
            console.log(`Создать папку ${newArticle} не удалось.`)
            return false
        }
    }
    if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand, newArticle, 'big'))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, newArticle, 'big'))
        }catch(e) {
            console.log(`Создать папку big не удалось.`)
            return false
        }
    }
    if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand, newArticle, 'small'))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, newArticle, 'small'))
        }catch(e) {
            console.log(`Создать папку small не удалось.`)
            return false
        }
    }

    let files
        
    if (fs.existsSync(path.resolve(__dirname, '..', 'static', brand, article, 'big'))){
        files = fs.readdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'big'))
        if (files) {             
            files.forEach(i => {
                try {
                    fs.renameSync(
                        path.resolve(__dirname, '..', 'static', brand, article, 'big', i),
                        path.resolve(__dirname, '..', 'static', brand, newArticle, 'big', i)
                    )
                }catch(e) {
                    console.log(`Не удалось переместить файл ${i}.`);
                    return false
                }
            })
        }
    }
    if (fs.existsSync(path.resolve(__dirname, '..', 'static', brand, article, 'small'))){
        files = fs.readdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'small'))
        if (files) {             
            files.forEach(i => {
                try {
                    fs.renameSync(
                        path.resolve(__dirname, '..', 'static', brand, article, 'small', i),
                        path.resolve(__dirname, '..', 'static', brand, newArticle, 'small', i)
                    )
                }catch(e) {
                    console.log(`Не удалось переместить файл ${i}.`);
                    return false
                }
            })
        }
    }

    deleteOldFiles(brand, article)


    return true
    
}