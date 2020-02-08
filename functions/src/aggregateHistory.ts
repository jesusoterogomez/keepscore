import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const aggregateHistory = async (
    snapshot: functions.firestore.DocumentSnapshot,
    context: functions.EventContext
) => {
    const db = admin.firestore();
    admin.instanceId();

    // Get value of the newly added rating
    const { teams, createdAt }: any = snapshot.data();

    try {
        return teams.map(async (team: any) => {
            console.info('write data for team');

            const payloads = [
                {
                    uid: team.attack.uid,
                    role: 'attack',
                    teamMember: team.defense.uid,
                    createdAt: createdAt,
                    win: team.win,
                },
                {
                    uid: team.defense.uid,
                    role: 'defense',
                    teamMember: team.attack.uid,
                    createdAt: createdAt,
                    win: team.win,
                },
            ];

            return await Promise.all(
                payloads.map(payload => db.collection('history').add(payload))
            );
        });
    } catch (e) {
        console.info('error');
        console.info(e);
    }
};

export default aggregateHistory;
