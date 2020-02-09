import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Functions
import aggregateStatsFunction from './aggregateStats';
import aggregateHistoryFunction from './aggregateHistory';

import generateHistoryFunction from './generateHistory';
import generateStatsFunction from './generateStats';
import publishUpdateFunction from './publishUpdate';

const region = 'europe-west1';

// If the firebase function emulator is running, the functions won't have access to the production firebase services (firestore)
// if we don't override the GOOGLE_APPLICATION_CREDENTIALS environment variable to use the firebase service account.
// The .firebase.service_account.json is git ignored and can be downloaded from the Firebase console: (Project Settings > Service accounts)
// @see: https://github.com/firebase/firebase-tools/issues/1412#issuecomment-504561828
if (process.env.FUNCTIONS_EMULATOR) {
    const credentialPath = '../.firebase.service_account.json';
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialPath;
}

admin.initializeApp(functions.config().firebase);

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

export const publishUpdate = functions
    .region(region)
    .https.onCall(publishUpdateFunction);
