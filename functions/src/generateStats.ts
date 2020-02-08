import * as admin from 'firebase-admin';

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
            console.info('team', team);

            const members = [attack, defense];

            members.forEach(member => {
                const memberData = results[member.uid];

                if (!memberData) {
                    results[member.uid] = {
                        wonLast: win,
                        streak: win ? 1 : 0,
                        // longestStreak: win ? 1 : 0,
                        matches: 1,
                        wins: win ? 1 : 0,
                        losses: win ? 0 : 1,
                        doubles: 1,
                        singles: 0,
                    };
                } else {
                    results[member.uid] = {
                        wonLast: win,
                        streak:
                            win && memberData.wonLast
                                ? (memberData.streak || 0) + 1
                                : 0,
                        // longestStreak: win && wonLast ? memberData.longestStreak + 1 : 0,
                        matches: memberData.matches + 1,
                        wins: win ? memberData.wins + 1 : memberData.wins,
                        losses: win ? memberData.losses : memberData.losses + 1,
                        doubles: memberData.doubles + 1,
                        singles: 0,
                    };
                }
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
