
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')


module.exports = class NzetaAPI {
    
    static url = ""
    static token = ""

    constructor() {
        this.url = process.env.NZETA_API_URL
        this.token = process.env.NZETA_API_TOKEN
    }

    async structure() {
 
        let form = new FormData()

        form.append('token', this.token)
        form.append('site', 2)

        const body = { 
            token: this.token,
            site: 2
        }

        const config = { 
            headers: { 
                'User-Agent': 'AstElectro',
                'Content-Type': 'multipart/form-data'
            }
        }
        
        try {
            let { data } = await axios.post(this.url + "structure.php", body, config)

            if (data.error) return data.error

            return data
        }catch(e) {
            return e
        }

    }
}
