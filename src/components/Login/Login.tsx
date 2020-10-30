import React, {ElementRef, FC, useEffect, useRef} from 'react';
import mainStyle from '../../styles/mainStyle';
import logo from '../../assets/logo.jpg';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import TextInput from '../Common/TextInput';
import CustomCheckbox from '../Common/CustomCheckbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import {checkValidEmail} from '../../utils/Utils';
import {defaultTextInputState, TextInputStateType} from '../../@types/common/TextInput';
import {useDispatch, useSelector} from 'react-redux';
import {LOGIN} from '../../actions/ActionType';
import {LoginDataBodyType} from '../../@types/dataBody';
import {RootReducerType} from '../../@types/reducer';
import ERROR_CODE from '../../constants/ErrorCode';
import {Tooltip} from '@material-ui/core';
import CustomModal from '../Common/CustomModal';
import NetworkErrorModal from '../Common/NetworkErrorModal';

const Login: FC = () => {
	type TextInputHandleType = ElementRef<typeof TextInput>;
	type CheckboxHandleType = ElementRef<typeof CustomCheckbox>;
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const emailFieldRef = useRef<TextInputHandleType>(null);
	const passwordFieldRef = useRef<TextInputHandleType>(null);
	const checkboxRef = useRef<CheckboxHandleType>(null);
	const modalRef = useRef<ModalHandleType>(null);
	const loginErrorCode = useSelector<RootReducerType, number | undefined>((state) => state.userReducer.loginErrorCode);
	const dispatch = useDispatch();

	const onClickLogin = (): void => {
		const emailInputState: TextInputStateType = emailFieldRef.current?.getTextInputState() || defaultTextInputState;
		const passwordInputState: TextInputStateType = passwordFieldRef.current?.getTextInputState() || defaultTextInputState;
		const checkboxValue: boolean = checkboxRef.current?.getCheckboxValue() || false;
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
		const dataBody: LoginDataBodyType = {email: emailInputState.value.trim(), password: passwordInputState.value};
		// dispatch action login (mo file src/saga/loginSaga.ts)
		dispatch({type: LOGIN, dataBody, keepLogin: checkboxValue});
	};

	useEffect(() => {
		if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.ACCOUNT_NOT_EXSIST) {
			const emailInputState: TextInputStateType = emailFieldRef.current?.getTextInputState() || defaultTextInputState;
			emailFieldRef.current?.setTextInputState({...emailInputState, error: true, helperText: 'Account dose not exsist'})
		} else if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.WRONG_PASSWORD) {
			const passwordInputState: TextInputStateType = passwordFieldRef.current?.getTextInputState() || defaultTextInputState;
			passwordFieldRef.current?.setTextInputState({...passwordInputState, error: true, helperText: 'Wrong password'})
		} else if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.UNKNOW) {
			modalRef.current?.openModal();
		}
	}, [loginErrorCode]);

	return (
		<div style={{...mainStyle.fullScreen, backgroundImage: `url(${logo})`, backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<Box style={{width: 400, backgroundColor: '#eee', padding: 20}} borderRadius={20} borderColor={'primary.main'} border={2}>
				<InputLabel style={{textAlign: 'center', fontSize: 40, fontWeight: 'bold', color: 'black'}}>Login</InputLabel>
				<InputLabel style={{color: 'black'}}>Email address</InputLabel>
				<TextInput ref={emailFieldRef} label={'Enter email'} style={{width: 300}} variant={'outlined'} />
				<InputLabel style={{color: 'black', marginTop: 10}}>Password</InputLabel>
				<TextInput ref={passwordFieldRef} label={'Enter password'} style={{width: 300}} variant={'outlined'} type={'password'} />
				<div>
					<Tooltip title={'You will be automatic login in 7 days!'}>
						<FormControlLabel
							control={
								<CustomCheckbox ref={checkboxRef} checked={false} color={'primary'} />
							}
							label="Keep login"
						/>
					</Tooltip>
				</div>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Button variant="contained" color="primary" onClick={onClickLogin}>Login</Button>
				</div>
				{/* <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Button variant="contained" color="primary" onClick={() => {modalRef.current?.openModal();}}>Show Modal</Button>
				</div> */}
			</Box>
			<NetworkErrorModal ref={modalRef} />
		</div>
	);
};

export default Login;