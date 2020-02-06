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
                <Link
                    to="/"
                    getProps={({ isCurrent }) => ({
                        className: isCurrent ? 'active' : '',
                    })}
                >
                    <Home style={{ fontSize: 26 }} />
                </Link>
            </li>
            <li>
                <Link
                    to="stats"
                    getProps={({ isCurrent }) => ({
                        className: isCurrent ? 'active' : '',
                    })}
                >
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
                <Link
                    to="profile"
                    getProps={({ isCurrent }) => ({
                        className: isCurrent ? 'active' : '',
                    })}
                >
                    <Person style={{ fontSize: 26 }} />
                </Link>
            </li>
            <li>
                <Link
                    to="profile"
                    getProps={({ isCurrent }) => ({
                        className: isCurrent ? 'active' : '',
                    })}
                >
                    <Settings style={{ fontSize: 26 }} />
                </Link>
            </li>
        </ul>
    );
};

export default Menu;
