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
//@ts-ignore
import Fade from 'react-reveal/Fade';

type Props = RouteComponentProps;

type Stats = {
    uid: string;
    wonLast: boolean;
    streak: number;
    longestStreak: number;
    matches: number;
    wins: number;
    losses: number;
    score: number;
    win_percent: number;
    loss_percent: number;
    win_ratio: number;
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

const renderPositionBadge = (index: number, value: number | string) => {
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

const getResults = (stats: Stats[], property: string, filterFn?: any) => {
    let data = stats;

    if (filterFn) {
        data = data.filter(filterFn);
    }

    const groupedResults = lodash.groupBy(data, property);
    const resultKeys = Object.keys(groupedResults).map(s => Number(s));

    return lodash
        .chain(resultKeys)
        .uniq()
        .sortBy()
        .value()
        .reverse()
        .slice(0, 3)
        .map(i => groupedResults[i]);
};

const renderStats = (stats: Stats[]) => {
    if (stats.length === 0) {
        return <h1>No stats yet. Start playing!</h1>;
    }

    return (
        <div>
            <Fade duration={900} delay={300} top distance="20px" cascade>
                <StatLeaders
                    title="Top of the hill"
                    subtitle="Current streak (minimum 2 wins in a row)"
                    noResultsText="Win at least 2 matches to be here"
                    results={getResults(
                        stats,
                        'streak',
                        (stat: any) => stat.streak > 1
                    )}
                    handleMetric={stat => stat.streak}
                />

                <StatLeaders
                    title="Longest streak"
                    subtitle="Best streak of all times (minimum 2 wins in a row)"
                    noResultsText="Win at least 2 matches to be here"
                    results={getResults(
                        stats,
                        'longestStreak',
                        (stat: any) => stat.longestStreak > 1
                    )}
                    handleMetric={stat => stat.longestStreak}
                />

                <StatLeaders
                    title="Win %"
                    subtitle="Who's actually doing good (minimum 3 matches)"
                    results={getResults(
                        stats,
                        'win_percent',
                        (stat: any) => stat.matches > 2
                    )}
                    handleMetric={stat => stat.win_percent.toString() + '%'}
                />

                <StatLeaders
                    title="Score"
                    subtitle="(Wins - Loses)"
                    results={getResults(stats, 'score')}
                    handleMetric={stat => stat.score}
                />

                <StatLeaders
                    title="Most wins"
                    subtitle="Who was won the most games"
                    results={getResults(stats, 'wins')}
                    handleMetric={stat => stat.wins}
                />

                <StatLeaders
                    title="Most matches played"
                    subtitle="Who's really hooked with this?"
                    results={getResults(stats, 'matches')}
                    handleMetric={stat => stat.matches}
                />

                <StatLeaders
                    title="Biggest loser"
                    subtitle=":("
                    results={getResults(stats, 'losses')}
                    handleMetric={stat => stat.losses}
                />
            </Fade>
        </div>
    );
};

const StatLeaders = ({
    title,
    subtitle,
    results,
    noResultsText,
    handleMetric,
}: {
    title: string;
    subtitle: string;
    noResultsText?: string;
    results: Stats[][];
    handleMetric: (stats: Stats) => number | string;
}) => {
    return (
        <div>
            <h3>{title}</h3>
            <p style={{ fontSize: '90%', opacity: 0.7, marginTop: '8px' }}>
                {subtitle}
            </p>
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
                {noResultsText && results.length === 0 && (
                    <p>
                        <br />
                        {noResultsText}
                    </p>
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
