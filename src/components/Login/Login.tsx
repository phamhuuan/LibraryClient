import React, {ElementRef, FC, useEffect, useRef} from 'react';
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
import {useHistory} from 'react-router-dom';

import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';

import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }),
);

const Login: FC = () => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
	  setAnchorEl(event.currentTarget);
	};
  
	const handleMobileMenuClose = () => {
	  setMobileMoreAnchorEl(null);
	};
  
	const handleMenuClose = () => {
	  setAnchorEl(null);
	  handleMobileMenuClose();
	};
  
	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
	  setMobileMoreAnchorEl(event.currentTarget);
	};
  
	const menuId = 'primary-search-account-menu';
	const renderMenu = (
	  <Menu
		anchorEl={anchorEl}
		anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
		id={menuId}
		keepMounted
		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		open={isMenuOpen}
		onClose={handleMenuClose}
	  >
		<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
		<MenuItem onClick={handleMenuClose}>My account</MenuItem>
		<MenuItem onClick={handleMenuClose}>Login</MenuItem>
		<MenuItem onClick={handleMenuClose}>Logout</MenuItem>
	  </Menu>


	);
  
	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
	  <Menu
		anchorEl={mobileMoreAnchorEl}
		anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
		id={mobileMenuId}
		keepMounted
		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		open={isMobileMenuOpen}
		onClose={handleMobileMenuClose}
	  >


		<MenuItem onClick={handleProfileMenuOpen}>
		  <IconButton
			aria-label="account of current user"
			aria-controls="primary-search-account-menu"
			aria-haspopup="true"
			color="inherit"
		  >
			<AccountCircle />
		  </IconButton>
		  <p>Profile</p>
		</MenuItem>
	  </Menu>
	);
	
	type TextInputHandleType = ElementRef<typeof TextInput>;
	type CheckboxHandleType = ElementRef<typeof CustomCheckbox>;
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const emailFieldRef = useRef<TextInputHandleType>(null);
	const passwordFieldRef = useRef<TextInputHandleType>(null);
	const checkboxRef = useRef<CheckboxHandleType>(null);
	const modalRef = useRef<ModalHandleType>(null);
	const loginErrorCode = useSelector<RootReducerType, number | undefined>((state) => state.userReducer.loginErrorCode);
	const dispatch = useDispatch();
	const history = useHistory();

	const onClickLogin = (): void => {
		const emailInputState: TextInputStateType = emailFieldRef.current?.getTextInputState() || defaultTextInputState;
		const passwordInputState: TextInputStateType = passwordFieldRef.current?.getTextInputState() || defaultTextInputState;
		const checkboxValue: boolean = checkboxRef.current?.getCheckboxValue() || false;
		if (!checkValidEmail(emailInputState.value.trim())) {
			if (emailInputState.value === '') {
				// neu email la ''
				emailFieldRef.current?.setTextInputState({helperText: 'Enter an email', error: true});
				return;
			} else {
				// neu email khong hop le
				emailFieldRef.current?.setTextInputState({helperText: 'Invalid email address', error: true});
				return;
			}
		}
		if (passwordInputState.value === '') {
			passwordFieldRef.current?.setTextInputState({helperText: 'Enter a password', error: true});
			return;
		}
		const dataBody: LoginDataBodyType = {email: emailInputState.value.trim(), password: passwordInputState.value};
		// dispatch action login (mo file src/saga/loginSaga.ts)
		dispatch({type: LOGIN, dataBody, keepLogin: checkboxValue});
	};
	
	const goToResetPassword = () => {
		history.push('/resetPassword', {from: '/login'});
	}

	useEffect(() => {
		if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.ACCOUNT_NOT_EXSIST) {
			emailFieldRef.current?.setTextInputState({error: true, helperText: 'Account does not exsist'});
		} else if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.WRONG_PASSWORD) {
			passwordFieldRef.current?.setTextInputState({error: true, helperText: 'Wrong password'});
		} else if (loginErrorCode === ERROR_CODE.LOGIN_ERROR.UNKNOW) {
			modalRef.current?.openModal();
		}
	}, [loginErrorCode]);

	return (
		<div	>
			<div className={classes.grow} >
				<AppBar position="static">
					<Toolbar>
					<div className={classes.menuButton}>
						<HomeIcon/>
					</div>
					
					<Typography className={classes.title} variant="h6" noWrap>
						Swaying Duck Library
					</Typography>
					
					<div className={classes.search}>
						<div className={classes.searchIcon}>
						<SearchIcon />
						</div>
						<InputBase
						placeholder="Search…"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{ 'aria-label': 'search' }}
						/>
					</div>
					<div className={classes.grow} />
						<MenuItem onClick={handleProfileMenuOpen}>
							<IconButton
							aria-label="account of current user"
							aria-controls="primary-search-account-menu"
							aria-haspopup="true"
							color="inherit"
							>
							<AccountCircle />
							</IconButton>					
						</MenuItem>	
					</Toolbar>
				</AppBar>
			</div>
     		 {renderMobileMenu}
      		{renderMenu}
			<Box style={{width: 400, backgroundColor: '#eee', padding: 20, opacity: 0.95}} borderRadius={20} borderColor={'primary.main'} border={2}>
				<InputLabel style={{textAlign: 'center', fontSize: 40, fontWeight: 'bold', color: 'black'}}>Login</InputLabel>
				<InputLabel style={{color: 'black'}}>Email address</InputLabel>
				<TextInput ref={emailFieldRef} label={'Enter email'} style={{width: '100%'}} variant={'outlined'} />
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
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Button variant="contained" color="primary" onClick={onClickLogin}>Login</Button>
				</div>
			</Box>
			<NetworkErrorModal ref={modalRef} />
		</div>
	);
};

export default Login;
