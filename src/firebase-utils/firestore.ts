import firebase, { FirebaseError } from 'firebase';

enum Collections {
    USERS = 'users',
}

export const storeUser = async (user: firebase.User) => {
    const db = firebase.firestore();

    try {
        // Check if the user is logging in for the first time
        const query = await db
            .collection(Collections.USERS)
            .doc(user.uid)
            .get();

        const isNewUser = query.exists === false;

        let payload: any = {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            emailVerified: user.emailVerified,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        };

        // Add a created timestamp if it's a new user
        if (isNewUser) {
            payload.created = firebase.firestore.FieldValue.serverTimestamp();
        }

        const result = await db
            .collection(Collections.USERS)
            .doc(user.uid)
            .set(payload);

        return result;
    } catch (error) {
        const e = error as FirebaseError;
        console.log(e);
    }
};
