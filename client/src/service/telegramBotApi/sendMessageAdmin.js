import axios from 'axios'

import { TELEGRAM_CHAT_ID_ADMIN, URL } from '../../utils/consts'

const sendMessageAdmin = async (message) => {

    message = `Сообщение с сайта ${URL}\n\n` + message

    message = encodeURI(message)
        
    await axios.get(`https://api.telegram.org/bot${process.env.REACT_APP_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID_ADMIN}&text=-----------------------------------`)

    let url = `https://api.telegram.org/bot${process.env.REACT_APP_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID_ADMIN}&text=${message}&disable_web_page_preview=true`
        
    return await axios.get(url)
        
}

export default sendMessageAdmin
