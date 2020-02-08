import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const aggregateStats = async (
    snapshot: functions.firestore.DocumentSnapshot,
    context: functions.EventContext
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
                        return transaction.create(ref, {
                            wonLast: win,
                            streak: win ? 1 : 0,
                            matches: 1,
                            wins: win ? 1 : 0,
                            losses: win ? 0 : 1,
                            doubles: 1,
                            singles: 0,
                        });
                    }

                    console.info(`update existing stats`);
                    return transaction.update(ref, {
                        wonLast: win,
                        streak:
                            win && docData.wonLast
                                ? (docData.streak || 0) + 1
                                : win
                                ? 1
                                : 0,
                        matches: docData.matches + 1,
                        wins: win ? docData.wins + 1 : docData.wins,
                        losses: win ? docData.losses : docData.losses + 1,
                        doubles: docData.doubles + 1,
                        singles: 0,
                    });
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
