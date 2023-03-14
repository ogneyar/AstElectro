module.exports = class GuestDto {
    name
    phone
    email
    password
    role

    constructor(model) {
        this.name = model.name
        this.phone = Number(model.phone)
        this.email = model.email
        this.password = "0000"
        this.role = "GUEST"
    }
}
