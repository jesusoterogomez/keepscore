import React, { useState } from 'react';
import PageTitle from 'components/PageHeader';
import { Link, Redirect } from '@reach/router';
import { Close, Add, Remove, SyncAlt, Check } from '@material-ui/icons';
import PageContainer from 'components/PageContainer';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase, { User } from 'firebase/app';
import UserAvatar from 'components/UserAvatar';
import {
    Button,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';
import lodash from 'lodash';
import { ReactComponent as Attack } from 'resources/Attack.svg';
import { ReactComponent as Defense } from 'resources/Defense.svg';
import FirebaseUser from 'components/FirebaseUserAvatar';
import './CreateMatch.scss';

//@ts-ignore
import Fade from 'react-reveal/Fade';

const getAvailableUsers = (
    snapshot:
        | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
        | undefined,
    currentUser: User
): User[] => {
    if (!snapshot) {
        return [];
    }

    // Return list of users excluding current user
    return snapshot.docs
        .filter(doc => doc.id !== currentUser.uid)
        .map(doc => doc.data() as User);
};

const CreateMatch: React.FC = () => {
    const USERS_QUERY = firebase.firestore().collection('users');

    const [currentUser] = useAuthState(firebase.auth());
    const [snapshot] = useCollection(USERS_QUERY);

    const [
        matchType,
        // setMatchType
    ] = useState('2vs2');

    const [teammate, setTeammate] = useState<null | string>(null);

    const [flipTeamA, setFlipTeamA] = useState(false);
    const [flipTeamB, setFlipTeamB] = useState(false);

    const [opponents, setOpponents] = useState([] as string[]);

    const [teamScore, setTeamScore] = useState(0);
    const [opponentsScore, setOpponentsScore] = useState(0);

    const [isSaved, setIsSaved] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleTeammateClick = (_teammate: User) => {
        if (teammate === _teammate.uid) {
            return setTeammate(null);
        }

        if (opponents.includes(_teammate.uid)) {
            const index = opponents.indexOf(_teammate.uid);
            opponents.splice(index, 1);
            setOpponents([...opponents]);
        }

        // If opponent is already included, remove it
        return setTeammate(_teammate.uid);
    };

    const handleOponentClick = (opponent: User) => {
        // If opponent is already included, remove it
        if (opponents.includes(opponent.uid)) {
            const index = opponents.indexOf(opponent.uid);
            opponents.splice(index, 1);
            return setOpponents([...opponents]);
        }

        if (teammate && opponents.includes(teammate)) {
            setTeammate(null);
        }

        // If opponnets already has more than 2 users, discard the oldest one
        if (opponents.length === 2) {
            opponents.pop();
        }

        opponents.push(opponent.uid);
        return setOpponents([...opponents]);
    };

    const users = lodash.orderBy(
        getAvailableUsers(snapshot, currentUser as User),
        ['displayName'],
        ['asc']
    );

    let teamA = [
        {
            displayName: currentUser?.displayName,
            uid: currentUser?.uid,
            email: currentUser?.email,
            photoURL: currentUser?.photoURL,
        } as User,
        ...users.filter(u => teammate === u.uid),
    ];
    let teamB = opponents.map(o => users.find(u => u.uid === o)) as User[];

    if (flipTeamA) {
        teamA = teamA.slice().reverse();
    }

    if (flipTeamB) {
        teamB = teamB.slice().reverse();
    }

    const validateScore = (num: number) => {
        if (num > 10) {
            return 10;
        }

        if (num <= 0) {
            return 0;
        }

        return num;
    };

    const saveMatchResults = async () => {
        // Store refresh token in firestore

        const db = firebase.firestore();
        await db.collection('matches').add({
            type: matchType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            teams: [
                {
                    attack: teamA[0],
                    defense: teamA[1],
                    score: teamScore,
                    win: teamScore >= 10,
                },
                {
                    attack: teamB[0],
                    defense: teamB[1],
                    score: opponentsScore,
                    win: opponentsScore >= 10,
                },
            ],
        });

        setIsSaved(true);
    };

    const canSubmit =
        teamA.length === 2 &&
        teamB.length === 2 &&
        (teamScore === 10 || opponentsScore === 10);

    return (
        <div className="flex-column-100 create-match">
            {!currentUser && <Redirect to="login" noThrow />}
            {isSaved && <Redirect to="/" noThrow />}
            <PageTitle title="Create New">
                <Button>
                    <Link className="close-link" to="/">
                        Close&nbsp;
                        <Close style={{ fontSize: 20 }} />
                    </Link>
                </Button>
            </PageTitle>

            <PageContainer>
                <Fade duration={900} delay={300} top distance="20px" cascade>
                    <div className="scroll-container">
                        {/* Form goes here */}
                        {/* <h3 className="form-section-title">What type of match was it?</h3>
                <RadioButtons
                    options={[
                        { label: '2 vs 2', value: '2vs2' },
                        { label: '1 vs 1', value: '1vs1' },
                    ]}
                    value={matchType}
                    onChange={handleMatchTypeChange}
                /> */}
                        <h3 className="form-section-title">
                            Who was your teammate?
                        </h3>
                        <div className="team-list-container">
                            <div className="team-list">
                                {users.length === 0 && (
                                    <div
                                        className="team-list-item inline-block"
                                        onClick={() => {}}
                                    >
                                        <UserAvatar
                                            user={{} as User}
                                            isPlaceholder
                                            isLoading
                                        />
                                    </div>
                                )}
                                <Fade duration={600} delay={300} cascade>
                                    <div>
                                        {users.map(user => (
                                            <div
                                                key={user.uid}
                                                className="team-list-item"
                                                onClick={() =>
                                                    handleTeammateClick(user)
                                                }
                                            >
                                                <FirebaseUser
                                                    uid={user.uid}
                                                    className={
                                                        teammate === user.uid
                                                            ? 'highlight'
                                                            : ''
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Fade>
                            </div>
                        </div>

                        <h3 className="form-section-title">
                            Who did you play against?
                        </h3>
                        <div className="team-list-container">
                            <div className="team-list">
                                {users.length === 0 && (
                                    <div
                                        className="team-list-item inline-block"
                                        onClick={() => {}}
                                    >
                                        <UserAvatar
                                            user={{} as User}
                                            isPlaceholder
                                            isLoading
                                        />
                                    </div>
                                )}
                                <Fade duration={600} delay={300} cascade>
                                    <div>
                                        {users.map(user => (
                                            <div
                                                key={user.uid}
                                                className="team-list-item inline-block"
                                                onClick={() =>
                                                    user.uid !== teammate
                                                        ? handleOponentClick(
                                                              user
                                                          )
                                                        : null
                                                }
                                            >
                                                <FirebaseUser
                                                    uid={user.uid}
                                                    disabled={
                                                        user.uid === teammate
                                                    }
                                                    className={
                                                        opponents.includes(
                                                            user.uid
                                                        )
                                                            ? 'highlight'
                                                            : ''
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Fade>
                            </div>
                        </div>
                        <h3 className="form-section-title">
                            What was the score?
                        </h3>
                        <div className="scoreboard">
                            <div className="scoreboard-team">
                                <div className="scoreboard-counter">
                                    <div
                                        className="scoreboard-icon-wrapper"
                                        onClick={() =>
                                            teamScore > 0 &&
                                            setTeamScore(
                                                validateScore(teamScore - 1)
                                            )
                                        }
                                    >
                                        <Remove style={{ fontSize: 14 }} />
                                    </div>
                                    <input
                                        min={0}
                                        max={10}
                                        pattern="\\d*"
                                        type="number"
                                        onFocus={event => event.target.select()}
                                        value={teamScore}
                                        onChange={e =>
                                            setTeamScore(
                                                validateScore(
                                                    Number(e.target.value)
                                                )
                                            )
                                        }
                                    />
                                    <div
                                        className="scoreboard-icon-wrapper"
                                        onClick={() =>
                                            teamScore < 10 &&
                                            setTeamScore(
                                                validateScore(teamScore + 1)
                                            )
                                        }
                                    >
                                        <Add style={{ fontSize: 14 }} />
                                    </div>
                                </div>

                                <div className="scoreboard-team-members">
                                    {teamA.map((u, index) => (
                                        <div
                                            key={'teamA' + u.uid}
                                            className="scoreboard-avatar"
                                        >
                                            <UserAvatar
                                                user={u}
                                                showName
                                                firstName
                                            />

                                            {index === 0 && (
                                                <Attack
                                                    height="26px"
                                                    width="26px"
                                                />
                                            )}
                                            {index === 1 && (
                                                <Defense
                                                    height="26px"
                                                    width="26px"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    {teamA.length === 1 && (
                                        <div className="scoreboard-avatar">
                                            <UserAvatar
                                                key={'teamA-placeholder'}
                                                isPlaceholder
                                                showName
                                                user={{} as User}
                                            />
                                            <Defense
                                                height="26px"
                                                width="26px"
                                            />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={() => setFlipTeamA(!flipTeamA)}
                                    disabled={teamA.length !== 2}
                                    variant="outlined"
                                    style={{
                                        opacity: teamA.length !== 2 ? 0.3 : 1,
                                        color: 'white',
                                        textTransform: 'none',
                                        borderColor: 'white',
                                        marginTop: '1.5em',
                                        padding: '0.2em 1em',
                                    }}
                                >
                                    Swap&nbsp;
                                    <SyncAlt
                                        style={{
                                            fontSize: 14,
                                        }}
                                    />
                                </Button>
                            </div>

                            <div className="scoreboard-team">
                                <div className="scoreboard-counter">
                                    <div
                                        className="scoreboard-icon-wrapper"
                                        onClick={() =>
                                            opponentsScore > 0 &&
                                            setOpponentsScore(
                                                validateScore(
                                                    opponentsScore - 1
                                                )
                                            )
                                        }
                                    >
                                        <Remove style={{ fontSize: 14 }} />
                                    </div>
                                    <input
                                        min={0}
                                        max={10}
                                        step={1}
                                        type="number"
                                        pattern="\\d*"
                                        onFocus={event => event.target.select()}
                                        value={opponentsScore}
                                        onChange={e =>
                                            setOpponentsScore(
                                                validateScore(
                                                    Number(e.target.value)
                                                )
                                            )
                                        }
                                    />
                                    <div
                                        className="scoreboard-icon-wrapper"
                                        onClick={() =>
                                            opponentsScore < 10 &&
                                            setOpponentsScore(
                                                validateScore(
                                                    opponentsScore + 1
                                                )
                                            )
                                        }
                                    >
                                        <Add style={{ fontSize: 14 }} />
                                    </div>
                                </div>

                                <div className="scoreboard-team-members">
                                    {teamB.map((u, index) => (
                                        <div
                                            className="scoreboard-avatar"
                                            key={'teamB' + u.uid}
                                        >
                                            <FirebaseUser uid={u.uid} />
                                            {index === 0 && (
                                                <Attack
                                                    height="26px"
                                                    width="26px"
                                                />
                                            )}
                                            {index === 1 && (
                                                <Defense
                                                    height="26px"
                                                    width="26px"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    {teamB.length === 0 && (
                                        <>
                                            <div className="scoreboard-avatar">
                                                <UserAvatar
                                                    key={'teamB-placeholder-1'}
                                                    isPlaceholder
                                                    showName
                                                    user={{} as User}
                                                />
                                                <Attack
                                                    height="26px"
                                                    width="26px"
                                                />
                                            </div>
                                            <div className="scoreboard-avatar">
                                                <UserAvatar
                                                    key={'teamB-placeholder-2'}
                                                    isPlaceholder
                                                    showName
                                                    user={{} as User}
                                                />
                                                <Defense
                                                    height="26px"
                                                    width="26px"
                                                />
                                            </div>
                                        </>
                                    )}
                                    {teamB.length === 1 && (
                                        <div className="scoreboard-avatar">
                                            <UserAvatar
                                                key={'teamB-placeholder-3'}
                                                isPlaceholder
                                                showName
                                                user={{} as User}
                                            />
                                            <Defense
                                                height="26px"
                                                width="26px"
                                            />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={() => setFlipTeamB(!flipTeamB)}
                                    disabled={teamB.length !== 2}
                                    variant="outlined"
                                    style={{
                                        opacity: teamB.length !== 2 ? 0.3 : 1,
                                        color: 'white',
                                        borderColor: 'white',
                                        padding: '0.2em 1em',
                                        marginTop: '1.5em',
                                        textTransform: 'none',
                                    }}
                                >
                                    Swap&nbsp;
                                    <SyncAlt
                                        style={{
                                            fontSize: 14,
                                        }}
                                    />
                                </Button>
                            </div>
                        </div>

                        <div className="submit-match">
                            <Button
                                disabled={!canSubmit}
                                className="pink-button"
                                onClick={handleClickOpen}
                                // onClick={saveMatchResults}
                            >
                                Save match results
                                <Add />
                            </Button>

                            <SimpleDialog
                                open={openDialog}
                                onSave={saveMatchResults}
                                onClose={handleClose}
                            />
                        </div>
                    </div>
                </Fade>
            </PageContainer>
        </div>
    );
};

function SimpleDialog(props: {
    onClose: Function;
    onSave: Function;
    open: boolean;
}) {
    const { onClose, onSave, open } = props;

    const handleClose = () => {
        onClose();
    };

    const handleSave = () => {
        onSave();
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
        >
            <DialogTitle id="simple-dialog-title">Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Make sure teams and score are correct. This information
                    cannot be changed later.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    className="pink-button"
                    color="primary"
                    autoFocus
                >
                    Save&nbsp;
                    <Check fontSize={'small'} />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateMatch;
