import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getInitialStats, getUpdatedStats, Stats } from './utils/stats';

const aggregateStats = async (
    snapshot: functions.firestore.DocumentSnapshot,
    _: functions.EventContext
) => {
    const db = admin.firestore();
    admin.instanceId();

    // Get value of the newly added rating
    const data: any = snapshot.data();
    console.info('start function', data);

    try {
        return await data.teams.map(async (team: any) => {
            const { attack, defense, win } = team;
            console.info('team', team);

            const members = [attack, defense];

            const transactions = members.map(async member => {
                const ref = db.collection('stats').doc(member.uid);
                return db.runTransaction(async transaction => {
                    const doc = await transaction.get(ref);
                    const docData = doc.data();

                    console.info(`store stats for ${member.uid}`);
                    console.info(docData);

                    if (!docData) {
                        console.info(`create new stats`);
                        return transaction.create(ref, getInitialStats(win));
                    }

                    console.info(`update existing stats`);
                    return transaction.update(
                        ref,
                        getUpdatedStats(docData as Stats, win)
                    );
                });
            });

            return await Promise.all(transactions);
        });
    } catch (e) {
        console.info('error');
        console.info(e);
    }
};

export default aggregateStats;
