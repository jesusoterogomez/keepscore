import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { init } from 'firebase-utils/init';
import firebase from 'firebase/app';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import * as serviceWorker from './serviceWorker';
import Loader from 'components/Loader';
import './index.scss';

// Pages
import AppDashboard, { AppDashboardWithMenu } from 'views/AppDashboard';

import Feed from 'views/Feed';
import CreateMatch from 'views/CreateMatch';
import Profile from 'views/Profile';
import Settings from 'views/Settings';
import Stats from 'views/Stats';
import Login from 'views/Login';

import Toast from 'components/Toast';
import Changelog from 'components/Changelog';

const target = document.getElementById('root');

const PrivateRoutes = (props: any) => {
    const [user, isLoading] = useAuthState(firebase.auth());

    if (isLoading) {
        return <Loader />;
    }

    if (user) {
        return <AppDashboardWithMenu>{props.children}</AppDashboardWithMenu>;
    }

    return <Redirect from="" to="login" noThrow />;
};

const LoginRoute = (_: RouteComponentProps) => <Login />;
const FeedRoute = (_: RouteComponentProps) => <Feed />;
const CreateMatchRoute = (_: RouteComponentProps) => (
    <AppDashboard>
        <CreateMatch />
    </AppDashboard>
);

// Initialize firebase client
init();

const routes = (
    <Router>
        <PrivateRoutes path="/">
            <FeedRoute path="/" />
            <Profile path="/profile" />
            <Stats path="/stats" />
            <Settings path="/settings" />
        </PrivateRoutes>

        <CreateMatchRoute path="/new" />

        {/* Public routes */}
        <LoginRoute path="login" />

        {/* Dash
                Join
                Leave
                Settings */}
        {/* Account
                Services
                Settings
                Sign up
                Login */}
    </Router>
);

function usePrevious(value: any, def = {}) {
    const ref = React.useRef();
    useEffect(() => {
        ref.current = value;
    });

    if (!ref.current) {
        return def;
    }
    return ref.current;
}

const AppContainer = () => {
    const [user, isAuthLoading] = useAuthState(firebase.auth());
    const [appVersion, isAppVersionLoading] = useDocumentData(
        firebase
            .firestore()
            .collection('version')
            .doc('current')
    ) as [{ id: number; changes?: any }, any, any];

    const [isUserLoaded, setIsUserLoaded] = useState(false);

    // Flags to display in app messages
    const [showChangelog, setShowChangelog] = useState(false);
    const [showRestartNotice, setShowRestartNotice] = useState(false);

    const prev: any = usePrevious({
        user,
        appVersion,
        isAppVersionLoading,
        userVersion: appVersion ? appVersion.id : null,
    });

    useEffect(() => {
        const fetchUserVersion = async () => {
            const userLoggedIn = !prev.user && user && isUserLoaded === false;
            const userLoggedOut = !user && prev.user && isUserLoaded === true;

            if (userLoggedIn && user) {
                console.log('user logged in');

                const versionDoc = await firebase
                    .firestore()
                    .collection('version')
                    .doc('current')
                    .get();

                const appVersionData = versionDoc.data() as {
                    id: number;
                    changes?: any;
                };

                const snapshot = await firebase
                    .firestore()
                    .collection('users')
                    .doc(user.uid)
                    .get();

                const userData = snapshot.data() as {
                    appVersion?: number;
                };

                // If a new user logs in, the application still doesn't have data for the user
                const isNewUser = !userData;

                if (isNewUser) {
                    console.log('record app version for first time user');

                    await firebase
                        .firestore()
                        .collection('users')
                        .doc(user.uid)
                        .update({ appVersion: appVersionData.id });

                    setIsUserLoaded(true);
                    return false;
                }

                const userAppVersion = userData.appVersion || 0;
                if (appVersionData.id > userAppVersion) {
                    console.log('welcome to new version', appVersionData.id);

                    await firebase
                        .firestore()
                        .collection('users')
                        .doc(user.uid)
                        .update({ appVersion: appVersionData.id });

                    setShowChangelog(true);
                } else {
                    console.log('running current version', appVersionData.id);
                }

                setIsUserLoaded(true);
            }

            if (userLoggedOut) {
                console.log('user logged out');
                setIsUserLoaded(false);
                setShowRestartNotice(false);
            }

            if (
                isUserLoaded &&
                !isAppVersionLoading &&
                prev.appVersion &&
                appVersion.id > prev.appVersion.id
            ) {
                console.log('version updated');
                setShowRestartNotice(true);
            }
        };

        fetchUserVersion();
    }, [
        user,
        isUserLoaded,
        appVersion,
        isAppVersionLoading,
        isAuthLoading,
        prev.user,
        prev.isAppVersionLoading,
        prev.appVersion,
    ]);

    return (
        <>
            <Toast
                open={showRestartNotice}
                onClose={() => window.location.reload()}
                text={
                    'There is a new app version. Click this message to restart now'
                }
            />

            <Changelog
                open={showChangelog && appVersion && appVersion.changes}
                onClose={() => setShowChangelog(false)}
                changes={appVersion && appVersion.changes}
            />

            {routes}
        </>
    );
};

render(<AppContainer />, target);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
