

export default function getService(warning, nogabarit, sms) {

    let service

    if (warning) service = "4" // отметка осторожно

    if (nogabarit) {
        if (service) {
            service += ",12" // не габарит
        }else service = "12"
    }
    
    if (sms) {
        if (service) {
            service += ",41" // sms уведомление получателя
        }else service = "41"
    }
   
    return {
        service
    }
}
