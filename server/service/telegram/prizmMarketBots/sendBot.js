
const axios = require('axios')


async function sendBot({bot, chat_id, text, parse_mode, disable_web_page_preview, reply_to_message_id, reply_markup, disable_notification}) {
    
    let token = ""
    if (bot == "prizm_market_bot") token = process.env.TELEGRAM_PRIZM_MARKET_BOT_TOKEN
    if (bot == "zakaz_prizm_bot") token = process.env.TELEGRAM_ZAKAZ_PRIZM_BOT_TOKEN
    if (bot == "zakazLOTbot") token = process.env.TELEGRAM_ZAKAZLOTBOT_TOKEN

    text = encodeURI(text)
    
    if (reply_markup) {
        if (typeof(reply_markup) == "string") reply_markup = encodeURI(reply_markup)
        else  reply_markup = encodeURI(JSON.stringify(reply_markup))
    }

    let url = `https://api.telegram.org/bot${token}/sendMessage?`

    if (!chat_id) url += `chat_id=${proccess.env.TELEGRAM_CHAT_ID_ADMIN}&text=${text} - unknown chatId`
    else url += `chat_id=${chat_id}&text=${text}`
    
    if (parse_mode) url += `&parse_mode=${parse_mode}`
    else url += `&parse_mode=markdown`
    if (disable_web_page_preview !== undefined) url += `&disable_web_page_preview=${disable_web_page_preview}`
    else url += `&disable_web_page_preview=true`
    if (reply_to_message_id) url += `&reply_to_message_id=${reply_to_message_id}`
    if (reply_markup) url += `&reply_markup=${reply_markup}`
    if (disable_notification !== undefined) url += `&disable_notification=${disable_notification}`


    let { data } = await axios.post(url)

    return data

}

module.exports = sendBot