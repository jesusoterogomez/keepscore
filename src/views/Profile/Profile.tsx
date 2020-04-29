import React from 'react';
import firebase from 'firebase/app';
import PageTitle from 'components/PageHeader';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RouteComponentProps } from '@reach/router';
import PageContainer from 'components/PageContainer';
import UserAvatar from 'components/UserAvatar';
import UserStats from 'views/UserStats';
import './Profile.scss';

type Props = RouteComponentProps;

const Profile = (props: Props) => {
    const [user] = useAuthState(firebase.auth());

    if (user) {
        return (
            <div className="flex-column-100">
                <PageTitle title="Profile" />

                <PageContainer>
                    <div className="profile scroll-container">
                        <div className="profile-user">
                            <UserAvatar user={user} size={100} />
                            <h4 className="profile-user-name">
                                {user.displayName}
                            </h4>
                            <h5 className="profile-user-email">{user.email}</h5>
                        </div>

                        <UserStats uid={user.uid as string} />
                    </div>
                </PageContainer>
            </div>
        );
    }
    return <div>woot</div>;
};

export default Profile;
