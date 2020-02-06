import React from 'react';
import PageTitle from 'components/PageHeader';
import { ExitToApp, Sync } from '@material-ui/icons';
import { RouteComponentProps } from '@reach/router';
import PageContainer from 'components/PageContainer';
import { logout } from 'firebase-utils/auth';
import { Button } from '@material-ui/core';

type Props = RouteComponentProps;

const Settings = (props: Props) => {
    return (
        <div className="flex-column-100">
            <PageTitle title="Settings" />

            <PageContainer>
                <div className="profile">
                    <h3>General</h3>
                    <br />
                    <Button className="pink-button" onClick={logout}>
                        Log out
                        <ExitToApp />
                    </Button>
                    <br />
                    <br />
                    <h3>Reload app</h3>
                    <br />
                    <Button
                        className="pink-button"
                        onClick={() => window.location.reload()}
                    >
                        Reload
                        <Sync />
                    </Button>
                </div>
            </PageContainer>
        </div>
    );
};

export default Settings;
