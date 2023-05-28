import './styles/general.css';

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container, Message } from "semantic-ui-react";


import axios, {
	setAuthToken,
	loginUser as authLogin,
	logoutUser,
	registerUser,
	scheduleRefreshToken,
	getPatients,
	getDiagnoses
} from './controllers';

import { useStateValue } from "./state";
import {
	setPatientList,
	setDiagnosisList,
	loginUser, logoutUser as clearAuth,
	addScheduled, removeScheduled, removeAllScheduled,
	displayMessage, clearMessage
} from "./state/actions";

import { Auth, MessageVariation } from "./types/types";

import PatientListPage from "./pages/PatientListPage";
import PatientInfo from "./pages/PatientInfoPage/PatientInfo";
import DiagnosisListPage from "./pages/DiagnosisListPage";
import AuthenticationForm, { AuthenticationFormValues } from "./pages/AuthenticationPage";
import UserInfo from "./pages/UserInfo";

const App = () => {
	const [{ auth, scheduler, message }, dispatch] = useStateValue();
	let refreshHandler: NodeJS.Timeout | undefined = undefined;
	const [busy, setBusy] = useState<boolean>(false);
	//let checkBackendHandler: NodeJS.Timeout | undefined = undefined;
	//let backendStatus: boolean | null = null;

	React.useEffect(() => {
		// retrieve stored access token
		const storedToken = JSON.parse(localStorage.getItem('auth') || 'null') as Auth;
		dispatch(loginUser(storedToken));
		storedToken && setAuthToken(storedToken.token);
		// clear scheduled setTimeouts on page refresh
		window.addEventListener('beforeunload', () => clearScheduledTimeouts());
	}, []);

	React.useEffect(() => {
		const fetchPatientList = async (): Promise<void> => {
			try {
				dispatch(setPatientList(await getPatients()));
			}
			catch (e) {
				console.error(e);
			}
		};
		const fetchDiagnosisList = async (): Promise<void> => {
			try {
				const data = await getDiagnoses();
				dispatch(setDiagnosisList(data));
			}
			catch (error) {
				console.error(error);
			}
		};

		console.log(`user is logged ${auth ? 'in' : 'out'}`);
		// is logged in
		if (auth && auth.token) {
			void fetchPatientList();
			void fetchDiagnosisList();

			console.log('will schedule access token refresh');
			// schedule next access token refresh
			refreshHandler = scheduleRefreshToken(auth, (t: Auth) => {
				dispatch(loginUser(t));
				t && setAuthToken(t.token);
				localStorage.setItem('auth', JSON.stringify(t));
				// remove oldest scheduled task id
				dispatch(removeScheduled());
			});
		}
		// on logout
		else {
			// clear all scheduled tasks
			clearScheduledTimeouts();
		}
	}, [dispatch, auth?.id, auth?.token]);

	useEffect(() => {
		// if something went wrong with the refresh token
		if (refreshHandler === undefined) {
			clearScheduledTimeouts();
			return localStorage.removeItem('auth');
		}
		// otherwise save scheduled task id
		dispatch(addScheduled(refreshHandler));
		console.log('refreshHandler', refreshHandler);
	}, [refreshHandler]);

	const clearScheduledTimeouts = () => {
		scheduler.forEach((id, index, array) => {
			clearTimeout(id);
			if (index === array.length - 1) console.log(`cleared ${index + 1} scheduled tasks`);
		});
		dispatch(removeAllScheduled());
	};

	const submitCredentials = (username: string, password: string) => {
		setBusy(true);
		authLogin(username, password)
			.then(data => {
				console.log('access token', data);
				dispatch(loginUser(data));
				localStorage.setItem('auth', JSON.stringify(data));
				dispatch(displayMessage({
					text: { content: `Logged in successfully as ${data?.name || data?.username || ''}`, header: 'Authentication Completed' },
					type: MessageVariation.success
				}));
				setTimeout(() => { dispatch(clearMessage()); }, 3000);
			})
			.catch(error => {
				console.log(error);
				if (axios.isAxiosError(error)) {
					dispatch(displayMessage({
						text: { content: error.response?.data.error as string, header: 'Authentication Failed' },
						type: MessageVariation.error
					}));
					setTimeout(() => { dispatch(clearMessage()); }, 3000);
				}
			})
			.finally(() => {
				setBusy(false);
			});
	};

	const createUser = (username: string, password: string, name?: string) => {
		setBusy(true);
		registerUser(username, password, name)
			.then(res => {
				console.log('created user', res);
				dispatch(displayMessage({
					text: { header: 'Registration Completed', content: `User ${res.name || res.username} was created` },
					type: MessageVariation.success
				}));
			})
			.then(() => {
				// login new user
				//setTimeout(() => { submitCredentials(username, password); }, 1500);
				setTimeout(() => void new Promise((resolve) => { resolve(submitCredentials(username, password)); }), 1500);
			})
			.catch(error => {
				if (axios.isAxiosError(error)) {
					console.log('axios error', error.code, error.response?.data);
					dispatch(displayMessage({
						text: { header: 'Registration Failed', content: error.response?.data as string },
						type: MessageVariation.error
					}));
					//return;
				}
				console.log(error);
			})
			.finally(() => {
				setBusy(false);
			});
	};

	const exitApp = async () => {
		if (auth) {
			try {
				const res = await logoutUser(auth.id);
				if (res.status === 200) {
					localStorage.removeItem('auth');
					dispatch(clearAuth());
				}
			}
			catch (error) {
				console.log(error);
				dispatch(displayMessage({
					text: { header: 'Authentication Failed', content: `Logout failed for ${auth.name || auth.username}.` },
					type: MessageVariation.error
				}));
			}
		}
	};

	return (
		<div className="App">
			<Router>
				<Container>
					<Header as="h1">Patientor</Header>
					{auth?.token &&
						<React.Fragment>
							<Container
								fluid
								style={{ position: 'relative' }}
							>
								<Button as={Link} to="/" primary>
									Home
								</Button>
								<Button as={Link} to="/diagnoses" secondary>
									Diagnoses
								</Button>
								<Container
									style={{
										display: 'inline-flex',
										width: 'fit-content',
										height: '100%',
										position: 'absolute',
										right: '0',
										alignItems: 'center'
									}}
								>
									<span>logged in as <Link to={`/users/${auth.id}`}><strong>{auth.name || auth.username}</strong></Link>&nbsp;</span>
									<Button
										basic
										size="tiny"
										floated="right"
										icon="log out"
										content="log out"
										title="log out"
										onClick={() => { void exitApp(); }}
									>
									</Button>
								</Container>
							</Container>
							<Divider hidden />
							<Switch>
								<Route path="/patients/:id">
									<PatientInfo />
								</Route>
								<Route path="/diagnoses">
									<DiagnosisListPage />
								</Route>
								<Route path="/users/:id">
									<UserInfo />
								</Route>
								<Route exact path="/">
									<PatientListPage />
								</Route>
								<Route path="*">
									<Message error>
										<Message.Header>Error 404</Message.Header>
										<p>This page does not exist!</p>
									</Message>
								</Route>
							</Switch>
						</React.Fragment>
					}
					{!auth?.token &&
						<AuthenticationForm
							onSubmit={
								{
									auth: (values: AuthenticationFormValues) => { void submitCredentials(values.username, values.password); },
									register: (values: AuthenticationFormValues) => { void createUser(values.username, values.password, values.name); }
								}
							}
							busy={busy}
						/>
					}
					<Message
						hidden={!message?.show}
						error={message?.type === 'error'}
						success={message?.type === 'success'}
						warning={message?.type === 'warning'}
						info={message?.type === 'info'}
						onDismiss={() => { dispatch(clearMessage()); }}
						style={{ position: 'fixed', bottom: '.5%', width: 'inherit' }}
					>
						{message?.text.header && <Message.Header>{message.text.header}</Message.Header>}
						<Message.Content>{message?.text.content}</Message.Content>
					</Message>
				</Container>
			</Router>
		</div>
	);
};

export default App;
