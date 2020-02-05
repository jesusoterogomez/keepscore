import React from 'react';
import firebase from 'firebase';
import PageTitle from 'components/PageHeader';
import { ExitToApp } from '@material-ui/icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RouteComponentProps } from '@reach/router';
import PageContainer from 'components/PageContainer';
import { logout } from 'firebase-utils/auth';
import UserAvatar from 'components/UserAvatar';
import { Button } from '@material-ui/core';
import './Profile.scss';

type Props = RouteComponentProps;

const Profile = (props: Props) => {
    const [user] = useAuthState(firebase.auth());

    if (user) {
        return (
            <div className="flex-column-100">
                <PageTitle title="Profile" />

                <PageContainer>
                    <div className="profile">
                        <UserAvatar user={user} size={80} showEmail showName />
                        <br />
                        <br />
                        <Button className="pink-button" onClick={logout}>
                            Log out
                            <ExitToApp />
                        </Button>
                    </div>
                </PageContainer>
            </div>
        );
    }
    return <div>woot</div>;
};

export default Profile;
