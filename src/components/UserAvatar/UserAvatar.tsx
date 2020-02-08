import React, { useState } from 'react';
import { User } from 'firebase';
import UserPlaceholder from 'resources/user-placeholder.png';
import './UserAvatar.scss';

import { Button, DialogTitle, Dialog, DialogActions } from '@material-ui/core';
import UserStats from 'views/UserStats';

//@ts-ignore
import Fade from 'react-reveal/Fade';

type Props = {
    user: User;
    showName?: boolean;
    showEmail?: boolean;
    size?: number;
    className?: string;
    icon?: any;
    disabled?: boolean;
    isPlaceholder?: boolean;
    firstName?: boolean;
    isLoading?: boolean;

    enableStatsModal?: boolean;
};

const UserAvatar: React.FC<Props> = props => {
    const size = props.size || 60;

    const user = props.isPlaceholder
        ? ({
              photoURL: UserPlaceholder,
              displayName: '- -',
              email: '',
          } as User)
        : props.user;

    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <div
            onClick={props.enableStatsModal ? handleClickOpen : () => {}}
            className={`user-avatar ${
                props.disabled ? 'disabled' : ''
            } ${props.className || ''}`}
        >
            <StatsDialog open={openDialog} onClose={handleClose} user={user} />
            {props.icon && props.icon}
            {user.photoURL && (
                <div
                    className="user-avatar-photo"
                    style={{
                        height: size + 'px',
                        width: size + 'px',
                        background: !props.isLoading
                            ? `url("${user.photoURL}")`
                            : 'none',
                        backgroundSize: !props.isLoading ? 'cover' : '',
                    }}
                >
                    <div
                        className={
                            'user-avatar-photo-loading ' +
                            (props.isLoading ? 'active' : '')
                        }
                    />
                </div>
            )}
            {props.showName && (
                <div className="user-avatar-name">
                    {props.firstName
                        ? user.displayName?.split(' ')[0]
                        : user.displayName}
                </div>
            )}
            {props.showEmail && (
                <div className="user-avatar-email">{user.email}</div>
            )}
        </div>
    );
};

function StatsDialog(props: { onClose: Function; open: boolean; user: User }) {
    const { onClose, open, user } = props;

    const handleClose = (e: any) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <Fade duration={300} top distance="20px" cascade>
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                className="stats-dialog"
                onClose={handleClose}
                aria-labelledby="simple-dialog-title"
                open={open}
            >
                <DialogTitle id="simple-dialog-title">
                    {user.displayName}
                </DialogTitle>
                <div>
                    <UserStats uid={user.uid} className="dialog-embedded" />
                </div>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleClose}
                        className="pink-button"
                        color="primary"
                        autoFocus
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Fade>
    );
}

export default UserAvatar;
