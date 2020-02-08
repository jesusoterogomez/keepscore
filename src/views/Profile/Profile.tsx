import React from 'react';
import firebase from 'firebase';
import PageTitle from 'components/PageHeader';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RouteComponentProps } from '@reach/router';
import PageContainer from 'components/PageContainer';
import UserAvatar from 'components/UserAvatar';
import './Profile.scss';
import { useDocumentData } from 'react-firebase-hooks/firestore';

type Props = RouteComponentProps;

type Stats = {
    uid: string;
    matches: number;
    wins: number;
    loses: number;
    doubles: number;
    singles: number;
};

const Profile = (props: Props) => {
    const [user] = useAuthState(firebase.auth());
    const query = firebase.firestore().doc(`stats/${user?.uid as string}`);

    const [data, isLoading] = useDocumentData(query);

    const stats = data as Stats;

    if (user) {
        return (
            <div className="flex-column-100">
                <PageTitle title="Profile" />

                <PageContainer>
                    <div className="profile scroll-container">
                        <div className="profile-user">
                            <UserAvatar user={user} size={80} />
                            <h4 className="profile-user-name">
                                {user.displayName}
                            </h4>
                            <h5 className="profile-user-email">{user.email}</h5>
                        </div>
                        {isLoading === false && stats && (
                            <div className="user-stats">
                                <div className="row">
                                    <div className="column user-stats-item">
                                        <h3>Matches</h3>
                                        <h1>{stats.matches}</h1>
                                    </div>
                                    <div className="column user-stats-item">
                                        <h3>Score</h3>
                                        <h1>{stats.wins - stats.loses}</h1>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column user-stats-item">
                                        <h3>Wins</h3>
                                        <h1>{stats.wins}</h1>
                                    </div>
                                    <div className="column user-stats-item">
                                        <h3>Losses</h3>
                                        <h1>{stats.loses}</h1>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column user-stats-item">
                                        <h3>Win %</h3>
                                        <h1>
                                            {Math.round(
                                                (stats.wins / stats.matches) *
                                                    100
                                            )}
                                            %
                                        </h1>
                                    </div>
                                    <div className="column user-stats-item">
                                        <h3>Loss %</h3>
                                        <h1>
                                            {Math.round(
                                                (stats.loses / stats.matches) *
                                                    100
                                            )}
                                            %
                                        </h1>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column user-stats-item">
                                        <h3>Win/loss ratio</h3>
                                        <h1>{stats.wins / stats.loses}</h1>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </PageContainer>
            </div>
        );
    }
    return <div>woot</div>;
};

export default Profile;
