import React from 'react';
import './PageContainer.scss';

const PageContainer: React.FC = ({ children }) => {
    return <div className="page-container">{children}</div>;
};

export default PageContainer;
