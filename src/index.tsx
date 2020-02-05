import React from 'react';
import { render } from 'react-dom';
import { init } from 'firebase-utils/init';
import firebase from 'firebase';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as serviceWorker from './serviceWorker';
import Loader from 'components/Loader';
import './index.scss';

// Pages
import AppDashboard, { AppDashboardWithMenu } from 'views/AppDashboard';

import Feed from 'views/Feed';
import CreateMatch from 'views/CreateMatch';
import Profile from 'views/Profile';
import Stats from 'views/Stats';
import Login from 'views/Login';

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

render(routes, target);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
