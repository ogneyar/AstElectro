const path = require('path')
const fs = require('fs')


module.exports = function (brand, article) {

    if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand))){
        return
    }
    if (!fs.existsSync(path.resolve(__dirname, '..', 'static', brand, article))){
        return
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
                    console.log(`Не удалось прочесть папку big артикула ${article}.`);
                }

                try {
                    fs.rmdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'big'))
                } catch (e) {
                    console.log(`Не смог удалить папку big у артикула ${article}.`);
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
                    console.log(`Не удалось прочесть папку small артикула - ${article}.`);
                }

                try {
                    fs.rmdirSync(path.resolve(__dirname, '..', 'static', brand, article, 'small'))
                } catch (e) {
                    console.log(`Не смог удалить папку small у артикула ${article}.`);
                }
            }

            try {
                fs.rmdirSync(path.resolve(__dirname, '..', 'static', brand, article))
            } catch (e) {
                console.log(`Не смог удалить папку ${article}.`);
            }
            
        } catch(e) {
            console.log(`Не смог прочесть папку ${article}`)
        }
    }
}