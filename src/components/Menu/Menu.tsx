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
import { Button } from '@material-ui/core';

const MENU_ITEMS = [
    {
        to: '/',
        type: 'link',
        Icon: Home,
    },
    {
        to: 'stats',
        type: 'link',
        Icon: BarChart,
    },
    {
        to: 'new',
        type: 'cta',
        Icon: AddCircle,
    },
    {
        to: 'profile',
        type: 'link',
        Icon: Person,
    },
    {
        to: 'settings',
        type: 'link',
        Icon: Settings,
    },
];

const Menu: React.FC = () => {
    return (
        <ul className="bottom-menu">
            {MENU_ITEMS.map((item, key) => (
                <li key={key}>
                    {item.type === 'link' && (
                        <Link
                            to={item.to}
                            getProps={({ isCurrent }) => ({
                                className: isCurrent ? 'active' : '',
                            })}
                        >
                            <Button>
                                <item.Icon style={{ fontSize: 26 }} />
                            </Button>
                        </Link>
                    )}
                    {item.type === 'cta' && (
                        <Link to={item.to}>
                            <>
                                <item.Icon
                                    className="cta-button"
                                    style={{ fontSize: 60, color: '#ff6074' }}
                                />
                                <div className="cta-button-bg"></div>
                            </>
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Menu;
