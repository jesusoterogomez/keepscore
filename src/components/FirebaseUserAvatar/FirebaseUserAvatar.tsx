import React from 'react';
import firebase, { User } from 'firebase/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import UserAvatar from 'components/UserAvatar';

type Props = {
    uid: string;
} & any;

const FirebaseUser: React.FC<Props> = props => {
    const query = firebase
        .firestore()
        .collection('users')
        .doc(props.uid);

    const [data, isLoading] = useDocumentData(query);

    if (isLoading) {
        return (
            <UserAvatar
                user={{} as User}
                showName
                firstName
                isPlaceholder
                isLoading={true}
                {...props}
            />
        );
    }

    return (
        <UserAvatar
            user={data as User}
            // isLoading={true}
            showName
            firstName
            {...props}
        />
    );
};

export default FirebaseUser;
