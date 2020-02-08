import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Functions
import aggregateStatsFunction from './aggregateStats';
import aggregateHistoryFunction from './aggregateHistory';

import generateHistoryFunction from './generateHistory';
import generateStatsFunction from './generateStats';

const region = 'europe-west1';

admin.initializeApp(functions.config().firebase);
console.info('iid', admin.instanceId());

export const aggregateStats = functions
    .region(region)
    .firestore.document('matches/{matchId}')
    .onCreate(aggregateStatsFunction);

export const aggregateHistory = functions
    .region(region)
    .firestore.document('matches/{matchId}')
    .onCreate(aggregateHistoryFunction);

export const generateHistory = functions
    .region(region)
    .https.onCall(generateHistoryFunction);

export const generateStats = functions
    .region(region)
    .https.onCall(generateStatsFunction);
