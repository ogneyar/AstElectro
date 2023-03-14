const axios  = require("axios")
const qs = require('qs')
const Math = require('mathjs')


module.exports = class AlfaBank {
    
    static url = process.env.ALFA_BANK_API_URL
    
    static token = process.env.ALFA_BANK_TOKEN
    
    constructor() {
        // console.log("ALFA BANK API START");
    }

    static async curl(parameters) {
        // console.log("ALFA BANK CURL RUN");

        let { method, url } = parameters
        if (!method) method = "post"
        let response

        let headers = {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
        
        try {
            if (method === "get" && type === "json") url = url + "?" + qs.stringify(data)
            let options = { method, headers, url }
            await axios(options)
                .then(data => {
                    response = data.data
                })
                .catch(error => {
                    // console.log("ALFA BANK CURL ERROR: ",error);
                    response = { error }
                })
        }catch(e) {  
            // console.log("ALFA BANK CURL THROW: ",e);
            return { e }
        }
        // console.log("ALFA BANK CURL RESPONSE: ",response);
        return response
    }

    
    static async register(parameters) {
        // console.log("ALFA BANK REGISTER RUN");
        
        // три обязательных параметра
        if (!parameters.orderNumber) return {error: "Отсутствует объект orderNumber"}
        if (!parameters.returnUrl) return {error: "Отсутствует объект returnUrl"}
        if (!parameters.orderBundle) return {error: "Отсутствует объект orderBundle"}
        
        if (!this.token) return {error: "Отсутствует токен доступа"}
        
        if (!parameters.orderBundle.cartItems) return {error: "Отсутствует объект orderBundle.cartItems"}
        if (!parameters.orderBundle.cartItems.items) return {error: "Отсутствует объект orderBundle.cartItems.items"}
        if (!Array.isArray(parameters.orderBundle.cartItems.items)) return {error: "Объект orderBundle.cartItems.items должен быть массивом"}
        
        let amount = 0

        try {
            parameters.orderBundle.cartItems.items.forEach(item => {
                if (!item.itemPrice) throw("В корзине отсутствует поле itemPrice")
                if (!item.quantity) throw("В корзине отсутствует поле quantity")
                if (!item.positionId) throw("В корзине отсутствует поле positionId")
                if (!item.name) throw("В корзине отсутствует поле name")
                if (!item.itemCode) throw("В корзине отсутствует поле itemCode")
                if (!item.tax) throw("В корзине отсутствует поле tax")
                if (!item.quantity.value) throw("В корзине отсутствует поле quantity.value")
                
				amount += Math.round(item.quantity.value * item.itemPrice)
            })
        }catch(error) {  
            // console.log("ALFA BANK REGISTER THROW: ",e);
            return { error }
        }
		
		//console.log(`\namount: ${amount}\n`)

        let data = {
            token: this.token,
            orderNumber: parameters.orderNumber,
            returnUrl: parameters.returnUrl,
            orderBundle: JSON.stringify(parameters.orderBundle),
            amount,
        }

        if (parameters.failUrl) data = {...data, failUrl: parameters.failUrl}
        if (parameters.description) data = {...data, description: parameters.description}
        if (parameters.sessionTimeoutSecs) {
            data = {...data, sessionTimeoutSecs: parameters.sessionTimeoutSecs}
        }else {
            data = {...data, sessionTimeoutSecs: 3600}
        }

        let response = await this.curl({ 
            method: "post", 
            url: this.url + "register.do" + "?" + qs.stringify(data)
        })

        return response
    }


}