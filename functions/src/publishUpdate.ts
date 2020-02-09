import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

type Changelog = {
    title: string;
    description: string;
}[];

type Version = {
    id: number;
    changes: Changelog;
};

type Data = {
    changes: Changelog;
};

const publishUpdate = async (
    data: Data,
    _: functions.https.CallableContext
) => {
    const db = admin.firestore();
    admin.instanceId();

    if (!data.changes || data.changes.length === 0) {
        // @example: {"changes": [{"title": "Change title", "description": "Change description"}]}
        throw new functions.https.HttpsError(
            'invalid-argument',
            `You must include a changelog with at least one entry to publish a new version:`
        );
    }

    const currentVersionDoc = await db
        .collection('version')
        .doc('current')
        .get();

    const versionData = currentVersionDoc.data() as Version;

    if (!versionData) {
        // First version published
        await db
            .collection('version')
            .doc('current')
            .set({
                id: 1,
                changes: data.changes,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

        return {
            message: 'Published version 1',
        };
    }

    // Copy current version data to its specific version number
    await db
        .collection('version')
        .doc(versionData.id.toString())
        .set(versionData);

    // Create new version
    const newVersionId = versionData.id + 1;
    await db
        .collection('version')
        .doc('current')
        .set({
            id: newVersionId,
            changes: data.changes,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

    return {
        message: `Published version ${versionData.id + 1}`,
    };
};

export default publishUpdate;
