import React from 'react';
import firebase from 'firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import './UserStats.scss';

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

    if (isLoading === true) {
        return null;
    }

    return (
        <div className={`user-stats ${className || ''}`}>
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
                    <h1>{Math.round((stats.wins / stats.matches) * 100)}%</h1>
                </div>
                <div className="column user-stats-item">
                    <h3>Loss %</h3>
                    <h1>{Math.round((stats.loses / stats.matches) * 100)}%</h1>
                </div>
            </div>
            <div className="row">
                <div className="column user-stats-item">
                    <h3>Win/loss ratio</h3>
                    <h1>
                        {Math.round((stats.wins / stats.loses) * 100) / 100}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default UserStats;
