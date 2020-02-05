import React from 'react';
import firebase from 'firebase';
import PageTitle from 'components/PageHeader';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { RouteComponentProps } from '@reach/router';
import PageContainer from 'components/PageContainer';
import Loader from 'components/Loader';
import lodash from 'lodash';
import './Stats.scss';
import FirebaseUser from 'components/FirebaseUserAvatar';

type Props = RouteComponentProps;

type Stats = {
    uid: string;
    matches: number;
    wins: number;
    loses: number;
    doubles: number;
    singles: number;
};

const renderStats = (stats: Stats[]) => {
    const { wins } = lodash.orderBy(stats, ['wins'], ['desc'])[0];
    const mostWins = stats.filter(s => s.wins === wins);

    const { matches } = lodash.orderBy(stats, ['matches'], ['desc'])[0];
    const mostMatches = stats.filter(s => s.matches === matches);

    return (
        <div>
            <h1>Most wins ({wins})</h1>
            <br />
            <div>
                {mostWins.map(u => (
                    <span key={u.uid} style={{ padding: '1em' }}>
                        <FirebaseUser uid={u.uid} />
                    </span>
                ))}
            </div>
            <br />
            <br />

            <h1>Most matches played ({matches})</h1>
            <br />
            <div>
                {mostMatches.map(u => (
                    <span key={u.uid} style={{ padding: '1em' }}>
                        <FirebaseUser uid={u.uid} />
                    </span>
                ))}
            </div>
        </div>
    );
};

const Profile = (props: Props) => {
    const query = firebase.firestore().collection('stats');

    const [data, isLoading] = useCollectionData(query, { idField: 'uid' });

    return (
        <div className="flex-column-100">
            <PageTitle title="Stats" />

            <PageContainer>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        {data ? (
                            renderStats(data as Stats[])
                        ) : (
                            <div>No stats</div>
                        )}
                    </div>
                )}
            </PageContainer>
        </div>
    );
};

export default Profile;
