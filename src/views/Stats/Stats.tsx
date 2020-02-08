import React from 'react';
import firebase, { User } from 'firebase';
import PageTitle from 'components/PageHeader';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { RouteComponentProps } from '@reach/router';
import PageContainer from 'components/PageContainer';
import Loader from 'components/Loader';
import lodash from 'lodash';
import './Stats.scss';
import FirebaseUser from 'components/FirebaseUserAvatar';
//@ts-ignore
import Fade from 'react-reveal/Fade';

type Props = RouteComponentProps;

type Stats = {
    uid: string;
    matches: number;
    wins: number;
    loses: number;
    doubles: number;
    singles: number;
};

const getAvatarSize = (index: number) => {
    switch (index) {
        case 0:
            return 70;
        case 1:
            return 55;
        case 2:
            return 45;
        default:
            return 60;
    }
};

const renderPositionBadge = (index: number, value: number) => {
    let position = null;

    switch (index) {
        case 0:
            position = '1st';
            break;
        case 1:
            position = '2nd';
            break;
        case 2:
            position = '3rd';
            break;
        default:
            position = '1st';
            break;
    }

    return (
        <span className={'badge ' + getPositionClassName(index)}>
            <span className={'badge-content'}>
                {position} <span className="separator">&nbsp;|&nbsp;</span>{' '}
                {value}
            </span>
        </span>
    );
};

const getPositionClassName = (index: number) => {
    switch (index) {
        case 0:
            return 'gold';
        case 1:
            return 'silver';
        case 2:
            return 'bronze';
        default:
            return 'gold';
    }
};

const renderStats = (stats: Stats[]) => {
    if (stats.length === 0) {
        return <h1>No stats yet. Start playing!</h1>;
    }

    const winsGrouped = lodash.groupBy(stats, 'wins');
    const winners = lodash
        .sortedUniq(Object.keys(winsGrouped))
        .reverse()
        .slice(0, 3)
        .map(i => winsGrouped[i]);

    const matchesGrouped = lodash.groupBy(stats, 'matches');
    const matches = lodash
        .sortedUniq(Object.keys(matchesGrouped))
        .reverse()
        .slice(0, 3)
        .map(i => matchesGrouped[i]);

    const losesGrouped = lodash.groupBy(stats, 'loses');
    const losers = lodash
        .sortedUniq(Object.keys(losesGrouped))
        .reverse()
        .slice(0, 3)
        .map(i => losesGrouped[i]);

    return (
        <div>
            <Fade duration={900} delay={300} top distance="20px" cascade>
                <StatLeaders
                    title="Most wins"
                    results={winners}
                    handleMetric={stat => stat.wins}
                />

                <StatLeaders
                    title="Matches played"
                    results={matches}
                    handleMetric={stat => stat.matches}
                />

                <StatLeaders
                    title="Biggest loser"
                    results={losers}
                    handleMetric={stat => stat.loses}
                />
            </Fade>
        </div>
    );
};

const StatLeaders = ({
    title,
    results,
    handleMetric,
}: {
    title: string;
    results: Stats[][];
    handleMetric: (stats: Stats) => number;
}) => {
    return (
        <div>
            <h3>{title}</h3>
            <div className="team-list-container stats-users">
                {results.map((w, i) =>
                    w.map(u => (
                        <div
                            key={u.uid}
                            className={'stats-user ' + getPositionClassName(i)}
                        >
                            <FirebaseUser
                                uid={u.uid}
                                enableStatsModal
                                size={getAvatarSize(i)}
                                className={getPositionClassName(i)}
                            />

                            {renderPositionBadge(i, handleMetric(u))}
                        </div>
                    ))
                )}
            </div>
            <br />
            <br />
        </div>
    );
};

const Stats = (props: Props) => {
    const query = firebase.firestore().collection('stats');
    const [data, isLoading] = useCollectionData(query, { idField: 'uid' });

    return (
        <div className="flex-column-100">
            <PageTitle title="Stats" />

            <PageContainer>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="scroll-container">
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

export default Stats;
