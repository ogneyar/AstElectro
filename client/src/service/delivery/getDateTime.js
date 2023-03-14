

export default function getDateTime() {

    let timestamp  = new Date()
    
    let year = timestamp.getFullYear().toString()
    let month = timestamp.getMonth() + 1
    if (month < 10) month = "0" + month.toString()
    else month = month.toString()
    let day = timestamp.getDate()
    if (day < 10) day = "0" + day.toString()
    else day = day.toString()
    let date = year + month + day // надо 20210912 (год, месяц и день слитно)

    let hour = timestamp.getHours()
    if (hour < 10) hour = "0" + hour.toString()
    else hour = hour.toString()
    let min = timestamp.getMinutes()
    if (min < 10) min = "0" + min.toString()
    else min = min.toString()
    // let sec = timestamp.getSeconds();
    let time = hour + min // надо 1026 (часы и минуты слитно)

    return {
        date,
        time
    }
}
