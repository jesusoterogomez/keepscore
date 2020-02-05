import React from 'react';
import { Autorenew } from '@material-ui/icons';
import './Loader.scss';

const Loader: React.FC = () => {
    return (
        <div className="loader">
            <div className="loader-circle">
                <Autorenew style={{ fontSize: 50 }} />
            </div>
        </div>
    );
};

export default Loader;
