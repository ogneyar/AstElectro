const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    surname: {type: DataTypes.STRING, defaultValue: null},
    name: {type: DataTypes.STRING, defaultValue: null},
    patronymic: {type: DataTypes.STRING, defaultValue: null},
    phone: {type: DataTypes.BIGINT, defaultValue: null},
    email: {type: DataTypes.STRING, unique: true},
    address: {type: DataTypes.STRING(1024), defaultValue: null},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    isActivated: {type: DataTypes.TINYINT, defaultValue: false},
    activationLink: {type: DataTypes.STRING, defaultValue: null},
    // дальнейшие данные для юр. лиц
    companyName: {type: DataTypes.STRING, defaultValue: null},
    INN: {type: DataTypes.STRING(10), defaultValue: null}, // ИНН - (максимум 10 знаков)
    KPP: {type: DataTypes.STRING(9), defaultValue: null}, // КПП - код причины постановки (максимум 9 знаков)
    OGRN: {type: DataTypes.STRING(15), defaultValue: null}, // ОГРН - основной государственный регистрационный номер (максимум 15 знаков)
    OKVED: {type: DataTypes.STRING(6), defaultValue: null}, // ОКВЭД - Общероссийский классификатор видов экономической деятельности (максимум 6 знаков)
    juridicalAddress: {type: DataTypes.STRING(1024), defaultValue: null}, // юридический адрес
    bank: {type: DataTypes.STRING, defaultValue: null}, // наименование банка
    BIK: {type: DataTypes.STRING(9), defaultValue: null}, // БИК - банковский идентификационный код (максимум 9 знаков)
    corAccount: {type: DataTypes.STRING(20), defaultValue: null}, // корреспондентский счёт (максимум 20 знаков)
    payAccount: {type: DataTypes.STRING(20), defaultValue: null}, // расчётный счёт (максимум 20 знаков)
    post: {type: DataTypes.STRING, defaultValue: null} // должность 
})

module.exports = User