import React from 'react';
import { User } from 'firebase';
import UserPlaceholder from 'resources/user-placeholder.png';
import './UserAvatar.scss';

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

    return (
        <div
            className={`user-avatar ${
                props.disabled ? 'disabled' : ''
            } ${props.className || ''}`}
        >
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

export default UserAvatar;
