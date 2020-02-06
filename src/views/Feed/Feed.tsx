import React from 'react';
import PageHeader from 'components/PageHeader';
import PageContainer from 'components/PageContainer';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase, { User, firestore } from 'firebase';
import { ReactComponent as Attack } from 'resources/Attack.svg';
import { ReactComponent as Defense } from 'resources/Defense.svg';
import moment from 'moment';

import './Feed.scss';
import Loader from 'components/Loader';
import FirebaseUser from 'components/FirebaseUserAvatar';

type Match = {
    createdAt: firestore.Timestamp;
    type: '2vs2' | '1vs1';
    teams: {
        attack: User;
        defense: User;
        score: number;
        win: boolean;
    }[];
};

const renderMatches = (matches: Match[]) => {
    if (matches.length === 0) {
        return <h1 style={{ padding: '0.5em' }}>Nothing to show yet</h1>;
    }

    return matches.map((match, key) => (
        <div key={key} className="feed-item">
            <div className="feed-item-container">
                <div className="feed-item-avatar">
                    <FirebaseUser size={50} uid={match.teams[0].attack.uid} />
                    <Attack height="22px" width="22px" />
                </div>
                <div className="feed-item-avatar">
                    <FirebaseUser size={50} uid={match.teams[0].defense.uid} />
                    <Defense height="22px" width="22px" />
                </div>

                <h2>
                    {match.teams[0].score} : {match.teams[1].score}
                </h2>

                <div className="feed-item-avatar">
                    <FirebaseUser size={50} uid={match.teams[1].attack.uid} />
                    <Attack height="22px" width="22px" />
                </div>
                <div className="feed-item-avatar">
                    <FirebaseUser size={50} uid={match.teams[0].defense.uid} />
                    <Defense height="22px" width="22px" />
                </div>
            </div>
            <div className="feed-item-footer">
                <span>{moment(match.createdAt.toDate()).fromNow()}</span>
                <span>
                    {moment(match.createdAt.toDate()).format(
                        'ddd, MMM Do - LT'
                    )}
                </span>
            </div>
        </div>
    ));
};

const Feed: React.FC = () => {
    const query = firebase
        .firestore()
        .collection('matches')
        .orderBy('createdAt', 'desc');
    const [snapshot, isLoading] = useCollection(query);

    const matches: Match[] =
        (snapshot && snapshot.docs.map(doc => doc.data() as Match)) || [];

    return (
        <div className="flex-column-100">
            <PageHeader title="Feed" />
            <PageContainer>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="feed-container">
                        <div className="feed-items">
                            {renderMatches(matches)}
                        </div>
                    </div>
                )}
            </PageContainer>
        </div>
    );
};

export default Feed;
