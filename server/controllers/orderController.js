const axios = require('axios')
const { v4 } = require('uuid')
const qs = require('qs')
const Math = require('mathjs')

const { Order, Product } = require('../models/models')
const ApiError = require('../error/apiError')
const AlfaBank = require('../service/payment/AlfaBank')
const sendMessage = require('../service/telegram/sendMessage')


class OrderController {

    async create(req, res, next) {
        try {
            let body = req.body //|| req.query
            if (body === undefined) return res.json({error: "Отсутствует тело запроса"}) 
            if (body.cart === undefined) return res.json({error: "Отсутствует корзина в теле запроса"}) 
            if (body.email === undefined) return res.json({error: "Отсутствует email в теле запроса"})
            let lastIndex

            let cart
            if (typeof(body.cart) === "string") cart = JSON.parse(body.cart)
            else cart = body.cart
		
            let items = cart.map((item, index) => {
                lastIndex = index + 1
                return {
                    positionId: lastIndex,
                    name: item.name,
                    quantity: { value: item.value, measure: "штук" },
                    itemCode: item.article,
                    tax: { taxType: 6 }, 
                    itemPrice: Math.round(item.price * 100) // перевод в копейки
                }
            })
            if (body.deliverySum !== undefined) {
                items = [ ...items, {
                    positionId: lastIndex + 1,
                    name: "Доставка",
                    quantity: { value: 1, measure: "штук" },
                    itemCode: "0001",
                    tax: { taxType: 6 }, 
                    itemPrice: Math.round(body.deliverySum * 100) // перевод в копейки
                }]
            }
			
            let create = { 
				cart: JSON.stringify(items), 
				uuid: v4(), 
				email: body.email 
			}
            // client - user_id
            if (body.client !== undefined) create = {...create, client: body.client}
            if (body.phone !== undefined) create = {...create, phone: body.phone}
            if (body.role !== undefined) create = {...create, role: body.role}
            if (body.address !== undefined) create = {...create, address: body.address}
            if (body.delivery !== undefined) create = {...create, delivery: body.delivery} 
            if (body.name !== undefined) create = {...create, name: body.name} 
            if (body.trackNumber !== undefined) create = {...create, trackNumber: body.trackNumber} 

            const order = await Order.create(create)

            if (!order.id) return res.json({error: "Отсутствует номер заказа (order.id) в ответе от БД"}) 
			
            let name = "", email = "", phone = "", delivery = "", address = "", cartStr = ""
			
            let id = `Запрос ПОДТВЕРЖДЕНИЯ заказа №${order.id}.\n\n`
            if (body.name !== undefined && body.name !== null) name = `Имя клиента ${body.name}\n\n`
			email = `Email клиента ${body.email}\n\n`
            if (body.phone !== undefined && body.phone !== null) phone = `Телефон клиента ${body.phone}\n\n`
            if (body.delivery !== undefined && body.delivery !== null) delivery = `Доставка: ${body.delivery === "pickup" ? "самовывоз" : body.delivery}\n\n`
            if (body.address !== undefined && body.address !== null) address = `Адрес доставки: ${body.address}\n\n`
            
            cartStr = `Корзина: \n${items.map(i => {
                return "Артикул: " + i.itemCode + ". Наименование: " + i.name + " - " + i.quantity.value + ` шт. (Цена за штуку - ${i.itemPrice/100}р.) - ` + i.quantity.value * i.itemPrice/100 + "р.\n"
            })}\n\n`
				
			sendMessage(id + name + email + phone + delivery + address + cartStr)			
			
			return res.json({id: order.id})

        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода create! ' + "Error: " + e.message));
        }
    }


    async getPaymentLink(req, res, next) {
        try {
            let body = req.body //|| req.query
            if (body === undefined) return res.json({error: "Отсутствует тело запроса"}) 
            if (body.url === undefined) return res.json({error: "Отсутствует url в теле запроса"})
            if (body.uuid === undefined) return res.json({error: "Отсутствует uuid в теле запроса"})
            
            let url = body.url
            let uuid = body.uuid

            let order = await Order.findOne({ where: { uuid } })

            if (!order.id) return res.json({error: "Отсутствует номер заказа (order.id) в ответе от БД"}) 
            let orderNumber = order.id

            let returnUrl = url + "success?uuid=" + uuid + "&id=" + orderNumber

            let failUrl = url + "error"

            let items
            if (typeof(order.cart) === "string") items = JSON.parse(order.cart)
            else items = order.cart

            let orderBundle = {
                customerDetails: { email: order.email },
                cartItems: { items }
            }

            let data = {
                orderNumber,
                returnUrl,
                failUrl,
                orderBundle
            }

            if (body.description) data = {...data, description: body.description}
            if (body.sessionTimeoutSecs) data = {...data, sessionTimeoutSecs: body.sessionTimeoutSecs}

            let response = await AlfaBank.register(data)

            return res.json(response) // return 

        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getPaymentLink! ' + "Error: " + e.message));
        }
    }
	
    // 
    async getAll(req, res, next) {
        try {
            const orders = await Order.findAll()
            return res.json(orders) // return array
        }catch(e) {
            return next(res.json({error:'Ошибка метода getAll! ' + e}))
        }
    }

    //
    async editOrder(req, res, next) {
        try {
            const { id } = req.params
            const body = req.body
            const order = await Order.update(body, {
                where: { id }
            })
            return res.json(order) // return 
        }catch(e) {
            return next(res.json({error:'Ошибка метода editOrder! ' + e}))
        }
    }
    
    //
    async editOrderCart(req, res, next) {
        try {
            const { id } = req.params
            const body = req.body
            if (body === undefined) return res.json({error: "Отсутствует тело запроса"}) 

            let { 
				positionId, // обязательный параметр, кроме как при addPosition
				addPosition, 
				deletePosition, 
				editQuantity, 
				editPrice, 
				article, 
				quantity, 
				price // в копейках
			} = body
            if ( ! addPosition && positionId === undefined) return res.json({error: "Отсутствует поле positionId"}) 
            if (addPosition) {
                if (!article) return res.json({error: "Отсутствует поле article"}) 
                if (!quantity) quantity = 1
            }
			if (editQuantity) {
                if (!quantity) return res.json({error: "Отсутствует поле quantity"}) 
            }
			if (editPrice) {
                if (!price) return res.json({error: "Отсутствует поле price"}) 
            }

            let order = await Order.findOne({ where: { id } })
            let cart = order.cart
            if (typeof(cart) === "string") cart = JSON.parse(cart)

            if (deletePosition) { // удаление позиции
                if (cart.length === 1) return res.json({error: "В корзине всего одна позиция, необходимо удалить весь заказ!"}) 
                cart = cart.map(i => {
                    if (i.positionId === positionId) return null
                    if (i.positionId > positionId) return { ...i, positionId: i.positionId-1}
                    return i
                }).filter(i => i !== null)
            }else if (addPosition) { // добавление позиции
                let product = await Product.findOne({ where: { article } })
                if (!product) res.json({error: `Не смог найти артикул ${article} в БД`}) 
                let save
                if (order.delivery !== "pickup") {
                    save = cart[cart.length - 1]
                    cart = cart.filter(i => i.positionId !== cart.length)
                }
                cart.push({
                    positionId: cart.length + 1,
                    name: product.name,
                    quantity: { value: quantity, measure: "штук" },
                    itemCode: article,
                    tax: { taxType: 6 },
                    itemPrice: Math.round(product.price * 100) // перевод в копейки
                })
                if (order.delivery !== "pickup") cart.push({...save, positionId: save.positionId+1})

                // console.log(cart);

            }else if (editQuantity) { // изменение количества
				cart = cart.map(i => {
                    if (i.positionId === positionId) 
						return { 
							...i, 
							quantity: { ...i.quantity, value: quantity }
						}
                    return i
                })
            }else if (editPrice) { // изменение цены
				cart = cart.map(i => {
                    if (i.positionId === positionId) 
						return { 
							...i, 
							itemPrice: price 
						}
                    return i
                })
            }

            cart = JSON.stringify(cart)

            let response = await Order.update({cart}, {
                where: { id }
            })
			let newOrder = null
			if (response[0]) {
				newOrder = await Order.findOne({ where: { id } })
			}
				
            return res.json(newOrder) // return 
        }catch(e) {
            return next(res.json({error:'Ошибка метода editOrderCart! ' + e}))
        }
    }

    //
    async setTaken(req, res, next) {
        try {
            const { id } = req.params
            const order = await Order.update({ state: "taken"}, {
                where: { id }
            })
            return res.json(order) // return 
        }catch(e) {
            return next(res.json({error:'Ошибка метода setTaken! ' + e}))
        }
    }

    //
    async getOrdersForUser(req, res, next) {
        try {
            const { user_id } = req.params
            const order = await Order.findAll({
                where: { client: user_id }
            })
            if (order) {
                return res.json(order) // return 
            }
            return res.json(null) // return 
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getOrdersForUser! ' + "Error: " + e.message));
        }
    
    }

    //getOrder
    async getOrder(req, res, next) {
        try {
            const { id } = req.params
			let order = await Order.findOne({ where: { id } })
            if (order) return res.json(order) // return 
            return res.json(null) // return 
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getOrder! ' + "Error: " + e.message));
        }
    }
	
    //getOrderByUuid
    async getOrderByUuid(req, res, next) {
        try {
            const { uuid } = req.params
			let order = await Order.findOne({ where: { uuid } })
            if (order) return res.json(order) // return 
            return res.json(null) // return 
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода getOrderByUuid! ' + "Error: " + e.message));
        }
    }
    
    async setPay(req, res, next) {
        try {
            const { uuid } = req.params
            const order = await Order.update({pay:true},{
                where: { uuid }
            })
            if (order) {
                const data = await Order.findOne({
                    where: { uuid }
                })
                if (data && data.id !== undefined) {
                    let id = `Оплата заказа №${data.id} произведена.\n\n`
                    let name = ""
                    if (data.name !== undefined && data.name !== null) {
                        name = `Имя клиента ${data.name}\n\n`
                    }
                    let email = ""
                    if (data.email !== undefined && data.email !== null) {
                        email = `Email клиента ${data.email}\n\n`
                    }
                    let phone = ""
                    if (data.phone !== undefined && data.phone !== null) {
                        phone = data.phone.toString().replace('7', '8')
                        phone = `Телефон клиента ${phone}\n\n`
                    }
                    let delivery = ""
                    if (data.delivery !== undefined && data.delivery !== null) {
                        delivery = `Доставка: ${data.delivery === "pickup" ? "самовывоз" : data.delivery}\n\n`
                    }
                    let address = ""
                    if (data.address !== undefined && data.address !== null) {
                        address = `Адрес доставки: ${data.address}\n\n`
                    }
                    let cart = ""
                    if (data.cart !== undefined && data.cart !== null) {
                        if (Array.isArray(data.cart)) {
                            cart = data.cart
                        }else {
                            cart = JSON.parse(data.cart)
                        }
                        cart = `Корзина: \n${cart.map(i => {
                            return "Артикул: " + i.itemCode + ". Наименование: " + i.name + " - " + i.quantity.value + ` шт. (Цена за штуку - ${i.itemPrice/100}р.) - ` + i.quantity.value * i.itemPrice/100 + "р.\n"
                        })}\n\n`
                    }
                    let response = await sendMessage(id + name + email + phone + delivery + address + cart)
                    if (response.ok !== undefined && response.ok === true) return res.json(order) // return 
                    else {
                        sendMessage("Ошибка, не смог отправить сообщение об успешном заказе")
                        return res.json({error: "Ошибка, не смог отправить сообщение об успешном заказе"})
                    }
                }
                // await убрал, так как мне не нужен ответ от сервера
                sendMessage("Ошибка, не найден заказ с uuid = " + uuid)
                return res.json({error: "Ошибка, не найден заказ с uuid = " + uuid}) // return 
            }
            sendMessage("Ошибка, не смог обновить заказ с uuid = " + uuid)
            return res.json({error: "Ошибка, не смог обновить заказ с uuid = " + uuid}) // return 

        }catch(e) {
            // sendMessage("Ошибка метода setPay!")
            sendMessage("Ошибка метода setPay! Error: " + e.message)
            return next(ApiError.badRequest("Ошибка метода setPay! Error: " + e.message));
        }
    }

    async test(req, res, next) {
        try {
            return res.json("response") // return 
            
        }catch(e) {
            return next(ApiError.badRequest('Ошибка метода test! ' + "Error: " + e.message));
        }
    }

    

    // async delete(req, res, next) {
    //     try {
    //         const {id} = req.params
    //         const brand = await Brand.destroy({
    //             where: {id}
    //         })
    //         return res.json(brand) // return boolean
    //     }catch(e) {
    //         return next(ApiError.badRequest('Ошибка метода delete!'));
    //     }
    // }
    


}

module.exports = new OrderController()