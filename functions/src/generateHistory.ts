import * as admin from 'firebase-admin';

const generateHistory = async (_: any) => {
    const db = admin.firestore();
    admin.instanceId();

    const matches = await db.collection('matches').get();

    return matches.docs.map(m => {
        const { teams, createdAt }: any = m.data();

        console.info('fetched teams');
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
    });
};

export default generateHistory;
