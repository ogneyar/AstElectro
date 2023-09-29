
import HtmlReactParser from 'html-react-parser'

import { MAIL, ADDRESS_FULL, PHONE_ONE, PHONE_TWO, TIME_TO_WORK, MAIL_TWO } from '../../utils/consts'
import { mailClick, telClick } from '../../service/yandexMetrika/reachGoal'

import './FooterContacts.css'


const FooterContacts = () => {
    return (
        <div
            className="FooterContacts"
        >
            <div className="footer-title">
				<h3>Контакты</h3>
			</div>
            <div className="footer-static-content">
                <ul className="FooterContactsUl">
                    {/* <li>
                        <span className="fa fa-map-marker">&nbsp;</span>
                        <div className="media-body">
                            <p>{ADDRESS_FULL}</p>
                        </div>
                    </li> */}
                    <li>
                        <span className="fa fa-mobile">&nbsp;</span>
                        <div 
                            className="media-body"
                            onClick={telClick}
                        >
                            <p>{HtmlReactParser(PHONE_ONE)}</p>
                        </div>
                    </li>
                    <li>
                        <span className="fa fa-mobile">&nbsp;</span>
                        <div 
                            className="media-body"
                            onClick={telClick}
                        >
                            <p>{HtmlReactParser(PHONE_TWO)}</p>
                        </div>
                    </li>
                    <li>
                        <span className="fa fa-envelope-o">&nbsp;</span>
                        <div 
                            className="media-body"
                            onClick={mailClick}
                        >
                            <address>
                                {HtmlReactParser(MAIL)}
                            </address>
                        </div>
                    </li>
                    <li>
                        <span className="fa fa-envelope-o">&nbsp;</span>
                        <div 
                            className="media-body"
                            onClick={mailClick}
                        >
                            <address>
                                {HtmlReactParser(MAIL_TWO)}
                            </address>
                        </div>
                    </li>
                    {/* <li className="last">
                        <span className="fa fa-clock-o">&nbsp;</span>
                        <div className="media-body">
                            {HtmlReactParser(TIME_TO_WORK)}
                        </div>
                    </li> */}
                </ul>
            </div>
        </div>
    )
}

export default FooterContacts
