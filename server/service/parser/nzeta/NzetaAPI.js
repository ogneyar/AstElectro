
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const querystring = require('querystring')


module.exports = class NzetaAPI {
    
    static url = ""
    static token = ""

    constructor() {
        this.url = process.env.NZETA_API_URL
        this.token = process.env.NZETA_API_TOKEN
    }

    /*    
    Methods:
        structure
        structure_description
        items
        items_description
        purpose_name
        items_picture
        items_docs = []
        mask
        properties_group
        properties_purpose
        properties = []
        properties_values
        properties_items
        items_info = 404 PageNotFound
    */
    async post({ method, limit, z_id }) {
 
        const body = { 
            token: this.token,
            site: 2,
            limit,
            z_id
        }
        
        var post_data = querystring.stringify(body)

        const config = { 
            headers: { 
                "Accept": "*/*",
                'User-Agent': 'AstElectro',
                'Host': 'localhost',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            },
            // rejectUnauthorized: false,
        }
        
        try {
            let { data } = await axios.post(this.url + method + ".php", post_data, config)

            if (data.error) return data.error

            // if (method === "items") return data.length

            return data
        }catch(e) {
            return e.message
        }

    }

}
