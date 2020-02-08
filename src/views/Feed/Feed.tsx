import React, { useState } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import PageHeader from 'components/PageHeader';
import PageContainer from 'components/PageContainer';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase, { User, firestore } from 'firebase';
import { ReactComponent as Attack } from 'resources/Attack.svg';
import { ReactComponent as Defense } from 'resources/Defense.svg';
import moment from 'moment';

import './Feed.scss';

//@ts-ignore
import Fade from 'react-reveal/Fade';

import Loader from 'components/Loader';
import FirebaseUser from 'components/FirebaseUserAvatar';

type Match = {
    id: string;
    createdAt: firestore.Timestamp;
    type: '2vs2' | '1vs1';
    teams: {
        attack: User;
        defense: User;
        score: number;
        win: boolean;
    }[];
};

const renderMatches = (match: Match, index: number) => {
    // @todo: every 6 items, reset delay.
    return (
        <div key={match.id} className="feed-item">
            <Fade duration={1200} delay={0 + index * 50} top distance="20px">
                <div className="feed-item-container">
                    <div className="feed-item-avatar">
                        <FirebaseUser
                            enableStatsModal
                            size={46}
                            uid={match.teams[0].attack.uid}
                        />
                        <Attack height="20px" width="20px" />
                    </div>
                    <div className="feed-item-avatar">
                        <FirebaseUser
                            enableStatsModal
                            size={46}
                            uid={match.teams[0].defense.uid}
                        />
                        <Defense height="20px" width="20px" />
                    </div>

                    <div className="feed-item-score">
                        <span>{match.teams[0].score}</span>
                        <span>&nbsp;:&nbsp;</span>
                        <span>{match.teams[1].score}</span>
                    </div>

                    <div className="feed-item-avatar">
                        <FirebaseUser
                            enableStatsModal
                            size={46}
                            uid={match.teams[1].attack.uid}
                        />
                        <Attack height="20px" width="20px" />
                    </div>
                    <div className="feed-item-avatar">
                        <FirebaseUser
                            enableStatsModal
                            size={46}
                            uid={match.teams[1].defense.uid}
                        />
                        <Defense height="20px" width="20px" />
                    </div>

                    <div className="flex-break"></div>

                    <div className="feed-item-footer">
                        <div>{moment(match.createdAt.toDate()).fromNow()}</div>
                        <div>
                            {moment(match.createdAt.toDate()).format(
                                'ddd, MMM Do - LT'
                            )}
                        </div>
                    </div>
                </div>
            </Fade>
        </div>
    );
};

const Feed: React.FC = () => {
    const [user] = useAuthState(firebase.auth());
    const [filter, setFilter] = useState('all');

    const query = firebase
        .firestore()
        .collection('matches')
        .orderBy('createdAt', 'desc');

    const [matches, isLoading] = useCollectionData(query, { idField: 'id' });

    let items = matches as Match[];

    if (filter === 'mine' && matches) {
        items = (matches as Match[]).filter(match => {
            const uids = match.teams
                .map(t => [t.defense.uid, t.attack.uid])
                .flat(); // Player IDs in match

            // If current user is included in the match
            if (uids.includes((user as User).uid)) {
                return true;
            }

            return false;
        });
    }

    return (
        <div className="feed flex-column-100">
            <PageHeader title="Feed">
                <Select
                    className="feed-filter"
                    value={filter}
                    onChange={e => setFilter(e.target.value as string)}
                >
                    <MenuItem value={'all'}>All matches</MenuItem>
                    <MenuItem value={'mine'}>My matches</MenuItem>
                </Select>
            </PageHeader>
            <PageContainer>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="feed-container">
                        <div className="feed-items">
                            {items && items.length === 0 && (
                                <h1 style={{ padding: '0.5em' }}>
                                    Nothing to show yet
                                </h1>
                            )}
                            {items && items.length > 0 && (
                                <div>
                                    {items.map((m, i) =>
                                        renderMatches(m as Match, i)
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </PageContainer>
        </div>
    );
};

export default Feed;
