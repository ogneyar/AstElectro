const path = require('path')
const fs = require('fs')


module.exports = function (brand,article) {

    if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand))
        }catch(e) {
            console.log(`Создать папку ${brand} не удалось.`)
        }
    }
    if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand, article))){
        try {
            fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, article))
        }catch(e) {
            console.log(`Создать папку ${article} не удалось.`)
        }
        if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand, article, 'big'))){
            try {
                fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'big'))
            }catch(e) {
                console.log(`Создать папку big не удалось.`)
            }
        }
        if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand, article, 'small'))){
            try {
                fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'small'))
            }catch(e) {
                console.log(`Создать папку small не удалось.`)
            }
        }
    }else {
        try {
            let files
            const dir = fs.readdirSync(path.resolve(__dirname, '..', 'static', brand, article))

            if (dir) {
                try {
                    files = fs.readdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'big'))  
                    if (files) {             
                        files.forEach(i => {
                            try {
                                fs.unlinkSync(path.resolve(__dirname, '..', 'static', brand, article, 'big', i))
                            }catch(e) {
                                console.log(`Удаляемый файл ${i} не найден.`);
                            }
                        })
                    }
                }catch(e) {
                    try {
                        fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'big'))
                    }catch(e) {
                        console.log(`Создать папку big не удалось.`);
                    }
                }
            
                try {
                    files = fs.readdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'small'))
                    if (files) {
                        files.forEach(i => {
                            try {
                                fs.unlinkSync(path.resolve(__dirname, '..', 'static', brand, article, 'small', i))
                            }catch(e) {
                                console.log(`Удаляемый файл ${i} не найден.`);
                            }
                        })
                    }
                }catch(e) {
                    try {
                        fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'small'))
                    }catch(e) {
                        console.log(`Создать папку small не удалось.`);
                    }
                }
            }else {
                try {
                    fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'big'))
                }catch(e) {
                    console.log(`Создать папку big не удалось.`);
                }
                try {
                    fs.mkdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'small'))
                }catch(e) {
                    console.log(`Создать папку small не удалось.`);
                }
            }
            
        } catch(e) {
            console.log(`Не смог прочесть папку ${article}`)
        }
    }
}