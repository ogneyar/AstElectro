
import { NavLink } from '../myBootstrap'
import {    
    ABOUT_US_ROUTE, DELIVERY_ROUTE, PRIVACY_POLICY_ROUTE, RETURNS_POLICY_ROUTE,
    TERMS_OF_USE_ROUTE, WARRANTY_ROUTE
} from '../../utils/consts'

import './FooterInformation.css'


const FooterInformation = () => {

    return (
        <div
            className="FooterInformation"
        >
            <div className="footer-title">
				<h3>Информация</h3>
			</div>
            <div className="footer-static-content">
                <ul className="togle-footer">
                    <li>
                        <NavLink
                            className="NavLink Footer_NavLink Footer_NavLink_Info"
                            to={ABOUT_US_ROUTE}
                        >
                            О компании
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="NavLink Footer_NavLink Footer_NavLink_Info"
                            to={DELIVERY_ROUTE}
                        >
                            О доставке
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="NavLink Footer_NavLink Footer_NavLink_Info"
                            to={RETURNS_POLICY_ROUTE}
                        >
                            Условия возврата
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="NavLink Footer_NavLink Footer_NavLink_Info"
                            to={WARRANTY_ROUTE}
                        >
                            Гарантия и Сервис
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="NavLink Footer_NavLink Footer_NavLink_Info"
                            to={PRIVACY_POLICY_ROUTE}
                        >
                            Политика конфиденциальности
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="NavLink Footer_NavLink Footer_NavLink_Info"
                            to={TERMS_OF_USE_ROUTE}
                        >
                            Пользовательское соглашение
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default FooterInformation
