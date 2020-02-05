import React from 'react';
import './PageHeader.scss';
import Logo from 'resources/keepscore-logo-small.png';

type Props = { title: string | JSX.Element };

const PageHeader: React.FC<Props> = ({ title, children }) => {
    return (
        <div className="page-header">
            <div className="page-header-title">
                <img src={Logo} alt="top bar logo" height="36"></img>
                <h3 className="page-title-name">{title}</h3>
            </div>
            <div className="page-header-action">{children}</div>
        </div>
    );
};

export default PageHeader;
