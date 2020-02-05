import React from 'react';
import firebase from 'firebase';
import { loginWithGoogle } from 'firebase-utils/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Redirect } from '@reach/router';
import { Button } from '@material-ui/core';
import Logo from 'resources/keepscore-logo.png';

import './Login.scss';

const Profile = () => {
    const [user] = useAuthState(firebase.auth());

    if (user) {
        return <Redirect from="" to="/" noThrow />;
    }
    return (
        <div className="login">
            <img src={Logo} alt="Keepscore logo" height="100" />
            <h1 className="login-title">KEEPSCORE</h1>

            <Button className="login-button" onClick={loginWithGoogle}>
                Continue with Google
            </Button>
        </div>
    );
};

export default Profile;
