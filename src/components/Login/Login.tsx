import React, {ElementRef, FC, useEffect, useRef, useState} from 'react';
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
import {LOGIN,INCREASE,DECREASE,RESET, SET, INCREATE} from '../../actions/ActionType';
import {LoginDataBodyType} from '../../@types/dataBody';
import {RootReducerType} from '../../@types/reducer';
import ERROR_CODE from '../../constants/ErrorCode';
import {Tooltip} from '@material-ui/core';
import CustomModal from '../Common/CustomModal';
import NetworkErrorModal from '../Common/NetworkErrorModal';
import {PlusNumber,SetAttribute} from '../../@types/action';
import {LoginNumberStateType} from '../../@types/componentState/index';
import {useHistory} from 'react-router-dom';
import { propTypes } from 'react-bootstrap/esm/Image';

const Login: FC = () => {
	type TextInputHandleType = ElementRef<typeof TextInput>;
	type CheckboxHandleType = ElementRef<typeof CustomCheckbox>;
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const colorFieldRef=useRef<TextInputHandleType>(null);
	const sizeFieldRef=useRef<TextInputHandleType>(null);
	const numberFieldRef=useRef<TextInputHandleType>(null);
	const emailFieldRef = useRef<TextInputHandleType>(null);
	const passwordFieldRef = useRef<TextInputHandleType>(null);
	const checkboxRef = useRef<CheckboxHandleType>(null);
	const modalRef = useRef<ModalHandleType>(null);
	const loginErrorCode = useSelector<RootReducerType, number | undefined>((state) => state.userReducer.loginErrorCode);
	const number=useSelector<RootReducerType,number>((state)=>state.countReducer.number);//lay number tu countReducer
	// const string=useSelector<RootReducerType,string>((state)=>state.countReducer.number);
	const dispatch = useDispatch();
	const [state, setState] = useState<LoginNumberStateType>({
		value: 1,
		size: 40,
		color: 'black',
		login: 'Login'
	});

	const history = useHistory();

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
	const onSet=(): void=>{
		const colorInputState: TextInputStateType = colorFieldRef.current?.getTextInputState() || defaultTextInputState;
		const sizeInputState: TextInputStateType = sizeFieldRef.current?.getTextInputState() || defaultTextInputState;
		
		setState({...state, color: colorInputState.value});
		setState({...state,size: parseInt(sizeInputState.value,10)});
		// console.log(colorInputState.value);
		// console.log(parseInt(colorInputState.value,10));
		dispatch({type: SET,color: colorInputState.value});
	}
	 const onPlus=(): void=>{
			const numberInputState: TextInputStateType=numberFieldRef.current?.getTextInputState() || defaultTextInputState;
            
			setState({...state, value: state.value+1,color: 'red',size: state.size+2});
			
			dispatch({type: INCREATE,value: parseInt(numberInputState.value,10)});
	 };
	 const onMinus=():void=>{
		const numberInputState: TextInputStateType=numberFieldRef.current?.getTextInputState() || defaultTextInputState;
		setState({...state, value: state.value-1});
		 dispatch({type: DECREASE, value:parseInt(numberInputState.value,10)});
	 }
	 const onReset=():void=>{
		const numberInputState: TextInputStateType=numberFieldRef.current?.getTextInputState() || defaultTextInputState;
		setState({...state, value:1});
		 dispatch({type: RESET, value:parseInt(numberInputState.value,10)});
	 }

	const goToResetPassword = () => {
		history.push('/resetPassword', {from: '/login'});
	}

	useEffect(() => {
		if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.ACCOUNT_NOT_EXSIST) {
			const emailInputState: TextInputStateType = emailFieldRef.current?.getTextInputState() || defaultTextInputState;
			emailFieldRef.current?.setTextInputState({...emailInputState, error: true, helperText: 'Account does not exsist'});
		} else if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.WRONG_PASSWORD) {
			const passwordInputState: TextInputStateType = passwordFieldRef.current?.getTextInputState() || defaultTextInputState;
			passwordFieldRef.current?.setTextInputState({...passwordInputState, error: true, helperText: 'Wrong password'});
		} else if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.UNKNOW) {
			modalRef.current?.openModal();
		}
	}, [loginErrorCode]);

	return (
		<div style={{...mainStyle.fullScreen, backgroundImage: `url(${logo})`, backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<Box style={{width: 400, backgroundColor: '#eee', padding: 20}} borderRadius={20} borderColor={'primary.main'} border={2}>
				<InputLabel  style={{textAlign: 'center', fontSize: state.size, fontWeight: 'bold', color: state.color}}>Login</InputLabel>
				<p >{state.value}</p>
				<InputLabel style={{color: 'black'}}>Email address</InputLabel>
               
				<TextInput ref={emailFieldRef} label={'Enter email'} style={{width: 300}} variant={'outlined'} />
				<InputLabel style={{color: 'black', marginTop: 10}}>Password</InputLabel>
				<TextInput ref={passwordFieldRef} label={'Enter password'} style={{width: 300}} variant={'outlined'} type={'password'} />
				{/* string  */}
				<InputLabel style={{color: 'black', marginTop: 10}}>Number</InputLabel>
				<TextInput ref={numberFieldRef} label={'Enter Number'} style={{width: 300}} variant={'outlined'} type={'outlined'} />
				{/* <TextInput ref={emailFieldRef} label={'Enter email'} style={{width: '100%'}} variant={'outlined'} /> */}
				<InputLabel style={{color: 'black', marginTop: 10}}>Password</InputLabel>
				<TextInput ref={passwordFieldRef} label={'Enter password'} style={{width: '100%'}} variant={'outlined'} type={'password'} />
				<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
					<Tooltip title={'You will be automatic login in 7 days!'}>
						<FormControlLabel
							control={
								<CustomCheckbox ref={checkboxRef} checked={false} color={'primary'} />
							}
							label="Keep login"
						/>
					</Tooltip>
					<div style={{display: 'flex', flex: 1}} />
					<Button onClick={goToResetPassword}>
						<InputLabel style={{textAlign: 'center', textDecoration: 'underline'}}>Forgot password?</InputLabel>
					</Button>
				</div>
				<InputLabel>{number}</InputLabel>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Button style={{marginRight: 10}} variant="contained" color="primary" onClick={onClickLogin}  >Login</Button>
					<Button style={{marginRight: 10}} variant="contained" color="primary" onClick={onPlus} >Tang</Button>
					<Button style={{marginRight: 10}} variant="contained" color="primary" onClick={onMinus} >Giam</Button>
					<Button variant="contained" color="primary" onClick={onReset}>Reset</Button>
                       
				</div>
			</Box>

			<Box style={{width: 400, backgroundColor: '#eee', padding: 20}} borderRadius={20} borderColor={'primary.main'} border={2}>
				<InputLabel  style={{textAlign: 'center', fontSize: state.size, fontWeight: 'bold', color: state.color}}>{state.login} </InputLabel>
				<p >{state.value}</p>
				<InputLabel style={{color: 'black'}}>Color </InputLabel>
               
				<TextInput ref={colorFieldRef} label={'Enter color'} style={{width: 300}} variant={'outlined'} />
				<InputLabel  style={{color: 'black', marginTop: 10}}>Size </InputLabel>
				<TextInput ref={sizeFieldRef} label={'Enter password'}  style={{width: 300}} variant={'outlined'} type={'outlined'} />
				{/* string  */}
				
				{/* <TextInput ref={emailFieldRef} label={'Enter email'} style={{width: '100%'}} variant={'outlined'} /> */}
				
				
				{/* <IabcnputLabel>{state.login}</IabcnputLabel> */}
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Button style={{marginRight: 10}} variant="contained" onClick={onSet}  >SET</Button>
					
                       
				</div>
			</Box>

			<NetworkErrorModal ref={modalRef} />
		</div>
		
	);
};

export default Login;