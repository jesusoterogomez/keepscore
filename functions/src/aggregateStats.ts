import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const aggregateStats = async (
    snapshot: functions.firestore.DocumentSnapshot,
    context: functions.EventContext
) => {
    const db = admin.firestore();
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
                            matches: 1,
                            wins: win ? 1 : 0,
                            loses: win ? 0 : 1,
                            doubles: 1,
                            singles: 0,
                        });
                    }

                    console.info(`update existing stats`);
                    return transaction.update(ref, {
                        matches: docData.matches + 1,
                        wins: win ? docData.wins + 1 : docData.wins,
                        loses: win ? docData.loses : docData.loses + 1,
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

    // // Update aggregations in a transaction
    // return db.runTransaction(transaction => {
    //     return transaction.get(restRef).then(restDoc => {
    //         // Compute new number of ratings
    //         var newNumRatings = restDoc.data().numRatings + 1;

    //         // Compute new average rating
    //         var oldRatingTotal =
    //             restDoc.data().avgRating * restDoc.data().numRatings;
    //         var newAvgRating = (oldRatingTotal + ratingVal) / newNumRatings;

    //         // Update restaurant info
    //         return transaction.update(restRef, {
    //             avgRating: newAvgRating,
    //             numRatings: newNumRatings,
    //         });
    //     });
    // });
};

export default aggregateStats;

// await db.runTransaction(async transaction => {
//     const ref1Doc = await transaction.get(ref1);
//     const attackerData = ref1Doc.data();

//     console.info('store attacker data');
//     console.info(attackerData);

//     const { win } = team;

//     if (!attackerData) {
//         await transaction.create(ref1, {
//             matches: 1,
//             wins: win ? 1 : 0,
//             loses: win ? 0 : 1,
//             doubles: 1,
//             singles: 0,
//         });
//     } else {
//         await transaction.update(ref1, {
//             matches: attackerData.matches + 1,
//             wins: win ? attackerData.wins + 1 : attackerData.wins,
//             loses: win ? attackerData.loses : attackerData.loses + 1,
//             doubles: attackerData.doubles + 1,
//             singles: 0,
//         });
//     }

//     const ref2Doc = await transaction.get(ref2);
//     const defenseData = ref2Doc.data();

//     console.info('store attacker data');
//     console.info(defenseData);

//     if (!defenseData) {
//         await transaction.create(ref1, {
//             matches: 1,
//             wins: win ? 1 : 0,
//             loses: win ? 0 : 1,
//             doubles: 1,
//             singles: 0,
//         });
//     } else {
//         await transaction.update(ref2, {
//             matches: defenseData.matches + 1,
//             wins: win ? defenseData.wins + 1 : defenseData.wins,
//             loses: win ? defenseData.loses : defenseData.loses + 1,
//             doubles: defenseData.doubles + 1,
//             singles: 0,
//         });
//     }

//     return Promise.resolve();
// });
