import React, {ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import mainStyle from '../../styles/mainStyle';
import logo from '../../assets/logo.jpg';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import TextInput from '../Common/TextInput';
import Button from '@material-ui/core/Button';
import {checkValidEmail} from '../../utils/Utils';
import {defaultTextInputState, TextInputStateType} from '../../@types/common/TextInput';
import {ResetPasswordDataBodyType, SendResetPasswordEmailDataBodyType, VerifyPasswordDataBodyType} from '../../@types/dataBody';
import ERROR_CODE from '../../constants/ErrorCode';
import CustomModal from '../Common/CustomModal';
import NetworkErrorModal from '../Common/NetworkErrorModal';
import {useHistory, useLocation} from 'react-router-dom';
import H from 'history';
import Api from '../../sagas/api';
import {ResetPasswordComponentStateType} from '../../@types/componentState';
import {OK} from '../../constants/Constant';

const ResetPassword: FC = () => {
	type TextInputHandleType = ElementRef<typeof TextInput>;
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const emailFieldRef = useRef<TextInputHandleType>(null);
	const passwordFieldRef = useRef<TextInputHandleType>(null);
	const newPasswordFieldRef = useRef<TextInputHandleType>(null);
	const modalRef = useRef<ModalHandleType>(null);
	const history = useHistory();
	type LocationStateType = {
		from?: string;
	}
	const location: H.Location<LocationStateType> = useLocation<LocationStateType>();
	const [state, setState] = useState<ResetPasswordComponentStateType>({
		token: '',
		showPasswordField: false,
		showNewPasswordField: false,
		showCounting: false,
		timeLeft: 0,
	});

	useEffect(() => {
		console.log('hi');
		if (location?.state?.from !== '/login') {
			history.replace('/');
		}
	}, [history, location?.state?.from]);

	useEffect(() => {
		const timeout: NodeJS.Timeout = setTimeout(() => {
			if (state.timeLeft > 0) {
				setState({...state, timeLeft: state.timeLeft - 1});
			} else {
				setState({...state, showPasswordField: false, token: ''});
				clearTimeout(timeout);
			}
		}, 1000);
		return () => clearTimeout(timeout);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.timeLeft]);

	const onClickSendEmail = useCallback(async (): Promise<void> => {
		const emailInputState: TextInputStateType = emailFieldRef.current?.getTextInputState() || defaultTextInputState;
		if (!checkValidEmail(emailInputState.value.trim())) {
			if (emailInputState.value === '') {
				// neu email la ''
				emailFieldRef.current?.setTextInputState({...emailInputState, helperText: 'Enter an email', error: true});
				return;
			} else {
				// neu email khong hop le
				emailFieldRef.current?.setTextInputState({...emailInputState, helperText: 'Invalid email address', error: true});
				return;
			}
		}
		const dataBody: SendResetPasswordEmailDataBodyType = {email: emailInputState.value.trim()};
		const response = await Api.sendResetPasswordEmail(dataBody);
		if (response && response.data) {
			if (response.data.status === 'OK') {
				setState({...state, token: response.data.token, showPasswordField: true, showCounting: true, timeLeft: 120});
			} else {
				if (response.data.errorCode === ERROR_CODE.SEND_RESET_PASSWORD_ERROR.ACCOUNT_NOT_EXSIST) {
					emailFieldRef.current?.setTextInputState({...emailInputState, error: true, helperText: 'Account does not exsist'});
				} else {
					modalRef.current?.openModal();
				}
			}
		} else {
			modalRef.current?.openModal();
		}
	}, [state]);

	const onClickVerifyPassword = useCallback(async (): Promise<void> => {
		const emailInputState: TextInputStateType = emailFieldRef.current?.getTextInputState() || defaultTextInputState;
		const passwordInputState: TextInputStateType = passwordFieldRef.current?.getTextInputState() || defaultTextInputState;
		if (!checkValidEmail(emailInputState.value.trim())) {
			if (emailInputState.value === '') {
				// neu email la ''
				emailFieldRef.current?.setTextInputState({...emailInputState, helperText: 'Enter an email', error: true});
				return;
			} else {
				// neu email khong hop le
				emailFieldRef.current?.setTextInputState({...emailInputState, helperText: 'Invalid email address', error: true});
				return;
			}
		}
		if (passwordInputState.value === '') {
			passwordFieldRef.current?.setTextInputState({...passwordInputState, helperText: 'Enter a password', error: true});
			return;
		}
		const dataBody: VerifyPasswordDataBodyType = {email: emailInputState.value.trim(), password: passwordInputState.value, token: state.token};
		console.log(dataBody);
		const response = await Api.verifyPassword(dataBody);
		if (response && response.data) {
			if (response.data.status === OK) {
				setState({...state, showCounting: false, showNewPasswordField: true});
			} else {
				if (response.data.errorCode === ERROR_CODE.VERIFY_PASSWORD_ERROR.ACCOUNT_NOT_EXSIST) {
					emailFieldRef.current?.setTextInputState({...emailInputState, error: true, helperText: 'Account does not exsist'});
				} else if (response.data.errorCode === ERROR_CODE.VERIFY_PASSWORD_ERROR.WRONG_PASSWORD) {
					passwordFieldRef.current?.setTextInputState({...passwordInputState, error: true, helperText: 'Wrong password'});
				} else if (response.data.errorCode === ERROR_CODE.VERIFY_PASSWORD_ERROR.TOKEN_EXPIRED) {
					passwordFieldRef.current?.setTextInputState({...passwordInputState, error: true, helperText: 'Wrong password'});
				} else if (response.data.errorCode === ERROR_CODE.VERIFY_PASSWORD_ERROR.INVALID_TOKEN) {
					passwordFieldRef.current?.setTextInputState({...passwordInputState, error: true, helperText: 'Wrong password'});
				} else if (response.data.errorCode === ERROR_CODE.VERIFY_PASSWORD_ERROR.UNKNOW) {
					modalRef.current?.openModal();
				}
			}
		} else {
			modalRef.current?.openModal();
		}
	}, [state]);

	const onClickResetPassword = useCallback(async (): Promise<void> => {
		const emailInputState: TextInputStateType = emailFieldRef.current?.getTextInputState() || defaultTextInputState;
		const passwordInputState: TextInputStateType = passwordFieldRef.current?.getTextInputState() || defaultTextInputState;
		const newPasswordInputState: TextInputStateType = newPasswordFieldRef.current?.getTextInputState() || defaultTextInputState;
		if (!checkValidEmail(emailInputState.value.trim())) {
			if (emailInputState.value === '') {
				// neu email la ''
				emailFieldRef.current?.setTextInputState({...emailInputState, helperText: 'Enter an email', error: true});
				return;
			} else {
				// neu email khong hop le
				emailFieldRef.current?.setTextInputState({...emailInputState, helperText: 'Invalid email address', error: true});
				return;
			}
		}
		if (passwordInputState.value === '') {
			passwordFieldRef.current?.setTextInputState({...passwordInputState, helperText: 'Enter a password', error: true});
			return;
		}
		if (newPasswordInputState.value === '') {
			passwordFieldRef.current?.setTextInputState({...passwordInputState, helperText: 'Enter a password', error: true});
			return;
		}
		if (newPasswordInputState.value.length < 8) {
			passwordFieldRef.current?.setTextInputState({...passwordInputState, helperText: 'Password too short', error: true});
			return;
		}
		const dataBody: ResetPasswordDataBodyType = {email: emailInputState.value.trim(), password: passwordInputState.value, newPassword: newPasswordInputState.value};
		const response = await Api.resetPassword(dataBody);
		if (response && response.data) {
			if (response.data.status === OK) {
				history.goBack();
			} else {
				if (response.data.errorCode === ERROR_CODE.RESET_PASSWORD_ERROR.ACCOUNT_NOT_EXSIST) {
					emailFieldRef.current?.setTextInputState({...emailInputState, error: true, helperText: 'Account does not exsist'});
				} else if (response.data.errorCode === ERROR_CODE.RESET_PASSWORD_ERROR.WRONG_PASSWORD) {
					passwordFieldRef.current?.setTextInputState({...passwordInputState, error: true, helperText: 'Wrong password'});
				} else {
					modalRef.current?.openModal();
				}
			}
		} else {
			modalRef.current?.openModal();
		}
	}, [history]);

	const passwordField = useMemo((): ReactNode => {
		if (state.showPasswordField) {
			return (
				<div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
					<InputLabel style={{color: 'black', marginTop: 10}}>Password</InputLabel>
					<TextInput ref={passwordFieldRef} label={'Enter password'} style={{width: '100%'}} variant={'outlined'} type={'password'} />
				</div>
			);
		} else {
			return <div />
		}
	}, [state.showPasswordField]);

	const newPasswordField = useMemo((): ReactNode => {
		if (state.showNewPasswordField) {
			return (
				<div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
					<InputLabel style={{color: 'black', marginTop: 10}}>Password</InputLabel>
					<TextInput ref={newPasswordFieldRef} label={'Enter password'} style={{width: '100%'}} variant={'outlined'} type={'password'} />
				</div>
			);
		} else {
			return <div />
		}
	}, [state.showNewPasswordField]);

	const countdown = useMemo((): ReactNode => {
		if (state.showCounting) {
			return (
				<div style={{display: 'flex', width: '20%', alignItems: 'flex-end', justifyContent: 'center'}}>
					<InputLabel style={{fontSize: 40}}>{state.timeLeft}</InputLabel>
				</div>
			);
		} else {
			return <div />
		}
	}, [state.showCounting, state.timeLeft]);

	const sendEmailButton = useMemo((): ReactNode => {
		if (state.showPasswordField) {
			return <div />;
		} else {
			return (
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
					<Button variant="contained" color="primary" onClick={onClickSendEmail}>Send email</Button>
				</div>
			);
		}
	}, [onClickSendEmail, state.showPasswordField]);

	const resendEmailAndVerifyPasswordButton = useMemo((): ReactNode => {
		if (state.showPasswordField && !state.showNewPasswordField) {
			return (
				<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
					<Button variant="contained" color="primary" onClick={onClickSendEmail}>Resend email</Button>
					<div style={{width: 20}} />
					<Button variant="contained" color="primary" onClick={onClickVerifyPassword}>Verify password</Button>
				</div>
			);
		} else {
			return <div />;
		}
	}, [onClickSendEmail, onClickVerifyPassword, state.showNewPasswordField, state.showPasswordField]);

	const resetPasswordButton = useMemo((): ReactNode => {
		if (state.showNewPasswordField) {
			return (
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
					<Button variant="contained" color="primary" onClick={onClickResetPassword}>Update password</Button>
				</div>
			);
		} else {
			return <div />;
		}
	}, [onClickResetPassword, state.showNewPasswordField]);

	const emailField = useMemo((): ReactNode => (
		<div>
			<InputLabel style={{textAlign: 'center', fontSize: 40, fontWeight: 'bold', color: 'black'}}>Reset password</InputLabel>
			<InputLabel style={{color: 'black'}}>Your account's email address</InputLabel>
			<TextInput ref={emailFieldRef} label={'Enter email'} style={{width: '100%'}} variant={'outlined'} />
		</div>
	), []);

	return (
		<div style={{...mainStyle.fullScreen, backgroundImage: `url(${logo})`, backgroundSize: 'contain', backgroundPositionX: 'center', backgroundPositionY: 'center', backgroundRepeat: 'no-repeat', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<Box style={{width: 400, backgroundColor: '#eee', padding: 20}} borderRadius={20} borderColor={'primary.main'} border={2}>
				{emailField}
				<div style={{display: 'flex', flexDirection: 'row'}}>
					{passwordField}
					{countdown}
				</div>
				{newPasswordField}
				{sendEmailButton}
				{resendEmailAndVerifyPasswordButton}
				{resetPasswordButton}
			</Box>
			<NetworkErrorModal ref={modalRef} />
		</div>
	);
};

export default ResetPassword;