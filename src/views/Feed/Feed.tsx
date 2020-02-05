import React from 'react';
import PageHeader from 'components/PageHeader';
import PageContainer from 'components/PageContainer';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase, { User, firestore } from 'firebase';
import UserAvatar from 'components/UserAvatar';
import { ReactComponent as Attack } from 'resources/Attack.svg';
import { ReactComponent as Defense } from 'resources/Defense.svg';
import moment from 'moment';

import './Feed.scss';

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

const Feed: React.FC = () => {
    const query = firebase
        .firestore()
        .collection('matches')
        .orderBy('createdAt', 'desc');
    const [snapshot] = useCollection(query);

    const matches: Match[] =
        (snapshot && snapshot.docs.map(doc => doc.data() as Match)) || [];

    return (
        <div className="flex-column-100">
            <PageHeader title="Feed" />
            <PageContainer>
                <div className="feed-container">
                    <div className="feed-items">
                        {matches.map((match, key) => (
                            <div key={key} className="feed-item">
                                <div className="feed-item-container">
                                    <div className="feed-item-avatar">
                                        <UserAvatar
                                            size={50}
                                            user={match.teams[0].attack}
                                        />
                                        <Attack height="22px" width="22px" />
                                    </div>
                                    <div className="feed-item-avatar">
                                        <UserAvatar
                                            size={50}
                                            user={match.teams[0].defense}
                                        />
                                        <Defense height="22px" width="22px" />
                                    </div>

                                    <h2>
                                        {match.teams[0].score} :{' '}
                                        {match.teams[1].score}
                                    </h2>

                                    <div className="feed-item-avatar">
                                        <UserAvatar
                                            size={50}
                                            user={match.teams[1].attack}
                                        />
                                        <Attack height="22px" width="22px" />
                                    </div>
                                    <div className="feed-item-avatar">
                                        <UserAvatar
                                            size={50}
                                            user={match.teams[1].defense}
                                        />
                                        <Defense height="22px" width="22px" />
                                    </div>
                                </div>
                                <div className="feed-item-footer">
                                    <span>
                                        {moment(
                                            match.createdAt.toDate()
                                        ).fromNow()}
                                    </span>
                                    <span>
                                        {moment(
                                            match.createdAt.toDate()
                                        ).format('ddd, MMM Do - LT')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PageContainer>
        </div>
    );
};

export default Feed;
