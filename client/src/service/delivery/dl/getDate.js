

export default function getDate() {
    let date = new Date()

    let year = date.getFullYear()

    let month = Number(date.getMonth()) + 1
    if (month < 10) month = "0" + month.toString()
    
    let day = Number(date.getDate()) + 4
    if (day < 10) day = "0" + day.toString()

    return year + "-" + month + "-" + day
}