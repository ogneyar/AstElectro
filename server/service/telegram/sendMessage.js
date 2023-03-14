const axios = require('axios')

const TELEGRAM_CHAT_ID_ADMIN = 1038937592

async function sendMessage(message, firstMessage = true) {

    message = `Сообщение с сайта ${process.env.CORS_URL}\n\n` + message
    message = encodeURI(message)

    let url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?disable_web_page_preview=true&chat_id=${TELEGRAM_CHAT_ID_ADMIN}&text=`

    if (firstMessage) await axios.post(url + "-----------------------------------")

    let { data } = await axios.post(url + message)

    return data

}

module.exports = sendMessage