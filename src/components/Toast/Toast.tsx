import React from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type Props = {
    open: boolean;
    text: string;
    onClose: Function;
};

const Toast = ({ open = false, text, onClose }: Props) => {
    return (
        <Snackbar
            open={open}
            onClick={() => onClose()}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity="info" style={{ width: '100%' }}>
                <div className="row">
                    <span>{text}</span>
                </div>
            </Alert>
        </Snackbar>
    );
};

export default Toast;
