import React from 'react';
import {
    Button,
    DialogActions,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogContentText,
} from '@material-ui/core';

type Props = {
    open: boolean;
    onClose: Function;
    changes: { title: string; description: string }[];
};

const Toast = ({ open, onClose, changes }: Props) => {
    return (
        <Dialog fullWidth={true} maxWidth={'lg'} open={open}>
            <DialogTitle>What's new</DialogTitle>

            {open && (
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {changes.map(change => (
                            <div>
                                <h4>{change.title}</h4>
                                <p>{change.description}</p>
                            </div>
                        ))}
                    </DialogContentText>
                </DialogContent>
            )}

            <DialogActions style={{ justifyContent: 'center' }}>
                <Button
                    onClick={() => onClose()}
                    className="pink-button"
                    color="primary"
                    autoFocus
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Toast;
