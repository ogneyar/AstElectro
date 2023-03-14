//
import React, { useContext } from 'react'
// import { useHistory } from 'react-router-dom'

import { Context } from '../..'
import { API_URL } from '../../utils/consts'
import InfoPage from '../info/InfoPage'
// import { SCROLL_TOP, SCROLL_TOP_MOBILE } from '../../utils/consts'
// import scrollUp from '../../utils/scrollUp'
import './DealerPage.css'


const DealerPage = () => {

    const { userStore } = useContext(Context)

    // const history = useHistory()

    if (!userStore.isAuth) {
        //history.push("/login?returnUrl=/dealers")
    }

    return (
        <InfoPage>
            <div
                className="DealerPage"
            >
                <div
                    className="DealerPage_header"
                >
                    Интеграция с интернет магазинами
                </div>
                <div
                    className="DealerPage_body"
                >
                    <p>Уважаемые партнеры!</p>
                    <p>Мы предлагаем наш каталог продукции в формате JSON для импорта в ваши интернет-магазины.</p>
                    <p>Ссылка с актуальными данными:</p>
                    <a href={API_URL + "api/dealer/feed"}>{API_URL + "api/dealer/feed"}</a>
                </div>
                <div
                    className="DealerPage_description"
                >
                    <div>Наш каталог представляет из себя</div>
                    <div>массив объектов:</div>
                    <pre>
                    {
`[
  {
    article,          // артикул
    name,             // наименование продукции
    price,            // цена в рублях (РРЦ)
    description,      // описание
    characteristics,  // характеристики
    size: {
      weight,         // вес в кг
      width,          // ширина в мм
      height,         // высота в мм
      length,         // длина в мм
      volume          // объём в м.куб
    },
    image,            // ссылка на фото
    country,          // страна производства
    category: {
      name,           // наименование категории
      uri             // часть ссылки категории
      url             // полная ссылка категории
    },
    url,              // ссылка на продукцию
  }
]`
                    }
                    </pre>
                </div>

                {/* <br /> */}

                <div
                    className="DealerPage_description"
                >
                    <div>Пример:</div>

                    <pre>
                    {
`[
  {
    "`}<span>article</span>{`": "LT13100001",
    "`}<span>name</span>{`": "Отрезной круг (диск) по металлу 
      115x0,8x22",
    "`}<span>price</span>{`": "60.46",
    "`}<span>description</span>{`": "Премиальный отрезной круг по 
      металлу на бакелитовой связке российского 
      производства. Соответствует самым высоким 
      отечественным и международным стандартам. 
      Улучшенные характеристики обеспечивают 
      высокую производительность и увеличивают 
      ресурс работы.",
    "`}<span>characteristics</span>{`": "Тип исполнения;прямой;
      Макс. рабочая скорость, м/с;80;
      Диаметр диска, мм;115;
      Толщина диска, мм;0,8;
      Диаметр посадочного отверстия, мм;22"
    "`}<span>size</span>{`": {
      weight: 0.03,
      width: 115,
      height: 0,8,
      length: 115,
      volume: 0,00001
    },
    "`}<span>image</span>{`": "https://server.leidtogi.ru/leidtogi/
      LT13100001/big/993f9a2b-c52e-447b-a720-
      d37a945dfe7a.jpg",
    "`}<span>country</span>{`":"Россия",
    "`}<span>category</span>{`": {
      "`}<span>name</span>{`": "Отрезные круги",
      "`}<span>uri</span>{`":"otreznye-krugi",
      "`}<span>url</span>{`":"https://leidtogi.ru/otreznye-krugi"
    },
    "`}<span>url</span>{`": "https://leidtogi.ru/otreznoy-krug-
      disk-po-metallu-115x0-8x22_LT13100001"
  }
]`
                    }
                    </pre>
                </div>
            </div>
        </InfoPage>
    )
}

export default DealerPage