import React from 'react';
import Menu from 'components/Menu';
import './AppDashboard.scss';

export const AppDashboardWithMenu: React.FC = props => {
    return (
        <div className="app-dashboard">
            <div className="app-dashboard-container">{props.children}</div>
            <Menu />
        </div>
    );
};

const AppDashboard: React.FC = props => {
    return (
        <div className="app-dashboard">
            <div className="app-dashboard-container">{props.children}</div>
        </div>
    );
};

export default AppDashboard;
