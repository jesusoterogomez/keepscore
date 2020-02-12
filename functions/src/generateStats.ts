import * as admin from 'firebase-admin';
import { getInitialStats, getUpdatedStats } from './utils/stats';

const generateStats = async (_: any) => {
    const db = admin.firestore();
    admin.instanceId();

    const matches = await db
        .collection('matches')
        .orderBy('createdAt', 'asc')
        .get();

    const results = {} as any;

    matches.docs.forEach(m => {
        const { teams }: any = m.data();

        teams.forEach((team: any) => {
            const { attack, defense, win } = team;
            const members = [attack, defense];

            members.forEach(member => {
                const memberData = results[member.uid];

                if (!memberData) {
                    results[member.uid] = getInitialStats(win);
                    return;
                }

                results[member.uid] = getUpdatedStats(memberData, win);
                return;
            });
        });
    });

    const promises = Object.keys(results).map(uid => {
        return db
            .collection('stats')
            .doc(uid)
            .set(results[uid]);
    });

    await Promise.all(promises);

    return results;
};

export default generateStats;
