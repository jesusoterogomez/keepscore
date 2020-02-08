import React from 'react';
import firebase from 'firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import './UserStats.scss';

//@ts-ignore
import Fade from 'react-reveal/Fade';

type Props = {
    uid: string;
    className?: string;
};

type Stats = {
    uid: string;
    matches: number;
    wins: number;
    loses: number;
    doubles: number;
    singles: number;
};

const UserStats = ({ uid, className }: Props) => {
    const query = firebase.firestore().doc(`stats/${uid as string}`);

    const [data, isLoading] = useDocumentData(query);
    const stats = data as Stats;

    const renderScore = (title: string, calculateScore: Function) => {
        return (
            <>
                <h3>{title}</h3>
                <h1>
                    {isLoading ? (
                        <span style={{ opacity: 0.1 }}>-</span>
                    ) : (
                        <Fade>{calculateScore()}</Fade>
                    )}
                </h1>
            </>
        );
    };

    return (
        <div className={`user-stats ${className || ''}`}>
            <div className="row">
                <div className="column user-stats-item">
                    {renderScore('Matches', () => stats.matches)}
                </div>
                <div className="column user-stats-item">
                    {renderScore('Score', () => stats.wins - stats.loses)}
                </div>
            </div>
            <div className="row">
                <div className="column user-stats-item">
                    {renderScore('Wins', () => stats.wins)}
                </div>
                <div className="column user-stats-item">
                    {renderScore('Losses', () => stats.loses)}
                </div>
            </div>
            <div className="row">
                <div className="column user-stats-item">
                    {renderScore(
                        'Win %',
                        () =>
                            Math.round((stats.wins / stats.matches) * 100) + '%'
                    )}
                </div>
                <div className="column user-stats-item">
                    {renderScore(
                        'Loss %',
                        () =>
                            Math.round((stats.loses / stats.matches) * 100) +
                            '%'
                    )}
                </div>
            </div>
            <div className="row">
                <div className="column user-stats-item">
                    {renderScore(
                        'Win/loss ratio',
                        () => Math.round((stats.wins / stats.loses) * 100) / 100
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserStats;
