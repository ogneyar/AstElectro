//

module.exports = function (extension = "", prefix = "") {

    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let min = now.getMinutes()
    let sec = now.getSeconds()
    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`
    if (hour < 10) hour = `0${hour}`
    if (min < 10) min = `0${min}`
    if (sec < 10) sec = `0${sec}`

    if (extension && !extension.includes(".")) extension = "." + extension

    return `${prefix}${year}.${month}.${day}_${hour}.${min}.${sec}${extension}`

}
