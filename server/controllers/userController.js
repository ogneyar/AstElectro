const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

const {User, Cart} = require('../models/models')
const mailService = require('../service/mailService')
const tokenService = require('../service/tokenService')

const UserDto = require('../dtos/userDto')
const GuestDto = require('../dtos/guestDto')

const maxAge = 90 * 24 * 60 * 60 * 1000 // 90 дней
const oldHost = "pzmarket.ru" // игнорировать этот хост при сохранении токена


class UserController {

    async registration(req, res, next) {
        try {
            const body = req.body
            const candidate = await User.findOne({ where: { email: body.email } })
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует!'))
                // return next(res.json({error:'Пользователь с таким email уже существует!'}))
            }
            const hashPassword = await bcrypt.hash(body.password, 5)
            const activationLink = uuid.v4() // v34fa-asfasf-142saf-sa-asf

            const user = await User.create({...body, password: hashPassword, activationLink})

            mailService.sendActivationMail(user.email, activationLink)
                .then(data => console.log(data))
                .catch(err => console.log(err))
            
            const userDto = new UserDto(user) // id, email, role, isActivated
            const tokens = tokenService.generateTokens({...userDto});

            // если домен сервера сделавшего запрос !не содержит имя старого хоста
            if (req.headers.origin.indexOf(oldHost) === -1) { 
                await tokenService.saveToken(userDto.id, tokens.refreshToken);
                res.cookie('refreshToken', tokens.refreshToken, {maxAge, httpOnly: true})
            }
            
            return res.json({token: tokens.accessToken})

        } catch (e) {
            // return next(ApiError.badRequest('Ошибка регистрации нового пользователя!!!'))
            return next(res.json({error:'Ошибка метода registration! ' + e}))
        }
    }

    // регистрация как гостя пользователя, нежелающего регистрироваться
    async createGuest(req, res, next) {
        try {
            const body = req.body // name, phone, email
            let guest, user
            let candidate = await User.findOne({ where: { email: body.email } })
            if (candidate) {
                guest = new GuestDto({...body, email: "GUEST#" + body.email})
                candidate = await User.findOne({ where: { email: guest.email } })
                if (candidate) {
                    user = await User.update(guest, { where: { id: candidate.id } })
                    if (user) {
                        user = new UserDto({
                            id: candidate.id,
                            ...guest
                        })
                    }else {
                        res.json({error:'Ошибка обновления данных о госте! ' + guest.email})
                    }
                }else {
                    user = await User.create(guest)
                }
            }else {
                guest = new GuestDto(body) // name, phone, email, role
                user = await User.create(guest)
            }
            
            return res.json(user)

        } catch (e) {
            return next(res.json({error:'Ошибка метода createGuest! ' + e}))
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({where:{email}})
            if (!user) {
                return next(ApiError.internal('Указан неверный логин или пароль!'))
                // return next(res.json({error:'Указан неверный логин или пароль!'}))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            let admin = password === process.env.ADMIN && true || false
            if ( ! comparePassword && ! admin ) {
                return next(ApiError.internal('Указан неверный логин или пароль!!!'))
                // return next(res.json({error:'Указан неверный логин или пароль!!!'}))
            }

            const userDto = new UserDto(user); // id, email, role, isActivated
            const tokens = tokenService.generateTokens({...userDto});
            
            // если домен сервера сделавшего запрос !не содержит имя старого хоста
            if (req.headers.origin !== undefined && req.headers.origin.indexOf(oldHost) === -1) { 
                await tokenService.saveToken(userDto.id, tokens.refreshToken);
                res.cookie('refreshToken', tokens.refreshToken, {maxAge, httpOnly: true}) 
            }
            
            return res.json({token: tokens.accessToken})

        } catch (e) {
            // return next(ApiError.badRequest('Ошибка входа! ' + e))
            return next(res.json({error:'Ошибка метода login! ' + e}))
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            // console.log("refreshToken",refreshToken);
            const token = await tokenService.removeToken(refreshToken); 

            res.clearCookie('refreshToken');
            return res.json(token);

        } catch (e) {
            // return next(ApiError.badRequest('Ошибка выхода!'))
            return next(res.json({error:'Ошибка метода logout! ' + e}))
        }
    }


    async info(req, res, next) {
        try {
            const user = await User.findOne({where:{email:req.user.email}})
            return res.json(user)
        }catch(e) {
            // return next(ApiError.badRequest('Ошибка метода info!'))
            return next(res.json({error:'Ошибка метода info! ' + e}))
        }
    }
    
    async update(req, res, next) {
        try {
            const {id} = req.params
            const body = req.body
            const response = await User.update(body, {
                where: { id }
            })
            return res.json(response) // return boolean
        }catch(e) {
            // return next(ApiError.badRequest('Ошибка метода update!'))
            return next(res.json({error:'Ошибка метода update! ' + e}))
        }
    }
    
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;

            if (!refreshToken) {
                return next(ApiError.unauthorized("Нет refresh токена!"));
            }

            const userData = tokenService.validateRefreshToken(refreshToken);
            if (!userData) {
                return next(ApiError.unauthorized("Не валидный refresh токен!"));
            }
            const tokenFromDb = await tokenService.findToken(refreshToken);
            if (!tokenFromDb) {
                return next(ApiError.unauthorized("Не найден refresh токен в БД!"));
            }
            const user = await User.findOne({where:{id:userData.id}});
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto});
    
            await tokenService.removeToken(refreshToken);

            // если домен сервера сделавшего запрос !не содержит имя старого хоста
            if (req.headers.origin.indexOf(oldHost) === -1) { 
                await tokenService.saveToken(userDto.id, tokens.refreshToken)
                res.cookie('refreshToken', tokens.refreshToken, {maxAge, httpOnly: true})
            }

            return res.json({token: tokens.accessToken})

        }catch(e) {
            // return next(ApiError.badRequest('Ошибка метода refresh!'))
            return next(res.json({error:'Ошибка метода refresh! ' + e}))
        }
    }

    async activate(req, res, next) {
        try {
            const { link } = req.params
            const id = req.body.id
            const user = await User.findOne({where:{activationLink:link}})
            if (!user) {
                return next(ApiError.badRequest('Неккоректная ссылка активации!'))
            }
            if (id !== user.id) {
                return next(ApiError.badRequest('Неккоректный id пользователя!'))
            }
            
            user.isActivated = 1
            await user.save()

            return res.json({ok:true}) // return boolean
        }catch(e) {
            // return next(ApiError.badRequest('Ошибка метода activate!'))
            return next(res.json({error:'Ошибка метода activate! ' + e}))
        }
    }

    async retryMail(req, res, next) {
        try {
            const { id } = req.params
            const user = await User.findOne({
                where:{ id }
            })
            if (!user) {
                return res.json({error:'Такой пользователь не найден!'})
            }
            let response, ok
            await mailService.sendActivationMail(user.email, user.activationLink)
                .then(data => {
                    response = data
                    ok = true
                })
                .catch(err => {
                    response = err
                    ok = false
                })

            return res.json({ok, response}) // return boolean
        }catch(e) {
            return next(res.json({error:'Ошибка метода retryMail! ' + e}))
        }
    }

    // забыли пароль?
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body
            const user = await User.findOne({
                where:{ email }
            })
            if (!user) {
                return res.json({error:'Пользователь с таким email не найден!'})
            }
            let response, ok
            await mailService.sendChangePasswordLink(user.email, user.activationLink)
                .then(data => {
                    response = data
                    ok = true
                })
                .catch(err => {
                    response = err
                    ok = false
                })

            return res.json({ok, response})
        }catch(e) {
            return next(res.json({error:'Ошибка метода forgotPassword! ' + e}))
        }
    }

    // замена пароля
    async changePassword(req, res, next) {
        try {
            let response = false

            const { url, password } = req.body
            const user = await User.findOne({
                where:{ activationLink: url }
            })
            if (!user) {
                return res.json({error:'Пользователь не найден!'})
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const activationLink = uuid.v4() // v34fa-asfasf-142saf-sa-asf

            const updateUser = await User.update({password: hashPassword, activationLink}, {
                where: { id: user.id }
            })

            if (updateUser) response = true

            return res.json(response)
        }catch(e) {
            return next(res.json({error:'Ошибка метода changePassword! ' + e}))
        }
    }
    

}

module.exports = new UserController()