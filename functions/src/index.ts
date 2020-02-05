import * as functions from 'firebase-functions';

// Functions
import aggregateStatsFunction from './aggregateStats';
const region = 'europe-west1';

export const aggregateStats = functions
    .region(region)
    .firestore.document('matches/{matchId}')
    .onCreate(aggregateStatsFunction);
