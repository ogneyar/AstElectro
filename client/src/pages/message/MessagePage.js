import React from 'react'

import InfoPage from '../info/InfoPage'


// это тестовая страница, впринципе её можно удалять
const MessagePage = () => {
    return (
        <InfoPage>
            <div>
                <p>Ваше сообщение отправлено!</p>

                <p>Ответ Вам отправим на Ваш email</p>
            </div>
        </InfoPage>
    )
}

export default MessagePage
