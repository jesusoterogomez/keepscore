import React from 'react';
import { Link } from '@reach/router';
import {
    Home,
    BarChart,
    Person,
    Settings,
    AddCircle,
} from '@material-ui/icons';
import './Menu.scss';

const Menu: React.FC = () => {
    return (
        <ul className="bottom-menu">
            <li>
                <Link to="/">
                    <Home style={{ fontSize: 26 }} />
                </Link>
            </li>
            <li>
                <Link to="stats">
                    <BarChart style={{ fontSize: 26 }} />
                </Link>
            </li>
            <li>
                <Link to="new">
                    <>
                        <AddCircle
                            className="cta-button"
                            style={{ fontSize: 60, color: '#ff6074' }}
                        />
                        <div className="cta-button-bg"></div>
                    </>
                </Link>
            </li>
            <li>
                <Link to="profile">
                    <Person style={{ fontSize: 26 }} />
                </Link>
            </li>
            <li>
                <Link to="profile">
                    <Settings style={{ fontSize: 26 }} />
                </Link>
            </li>
        </ul>
    );
};

export default Menu;
