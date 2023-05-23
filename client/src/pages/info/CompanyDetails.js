//
import InfoWidePage from './InfoWidePage'

import './CompanyDetails.css'


const CompanyDetails = () => {
    return (
        <InfoWidePage>
            <div className="CompanyDetails">
                <header>Реквизиты компании.</header>
              <br />
              {/* <div className="AboutUsHead">
                  <label>«АСТ»</label>
                  &nbsp;-&nbsp;
                  <span>компания с успешным многолетним опытом и большим будущим...</span>
              </div> */}

              <ul>
                  <li><strong>Полное наименование:&nbsp;</strong>ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "АСТ"</li>
                  <li><strong>Сокращенное наименование:&nbsp;</strong>ООО «АСТ»</li>
                  <li><strong>Юридический адрес:&nbsp;</strong>195009, Санкт-Петербург г, Кондратьевский пр-кт, дом 14/10 литера Б помещение N 08</li>
                  <li><strong>Почтовый адрес:&nbsp;</strong>195009, Санкт-Петербург г, Кондратьевский пр-кт, дом 14/10 литера Б помещение N 08</li>
                  <li><strong>Телефон/факс:&nbsp;</strong>+7(812) 209-23-31 - телефон | +7 (968) 180-36-13 – телефон | +7 (904) 511-59-21 – телефон</li>
                  <li><strong>ИНН/КПП:&nbsp;</strong>7811711544 / 780401001</li>
              </ul>
          </div>
      </InfoWidePage>
    )
}

export default CompanyDetails
