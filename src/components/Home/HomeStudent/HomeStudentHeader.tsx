import React, {FC} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootReducerType} from '../../../@types/reducer';
import {UserType} from '../../../@types/entity';
import AppBar from '@material-ui/core/AppBar';
import {CLEAR_LOGIN_DATA} from '../../../actions/ActionType';
import {useHistory} from 'react-router-dom';
import Cookies from 'js-cookie';
import {ClearLoginDataActionType} from '../../../@types/action';import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';


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

const HomeStudentHeader: FC = () => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);  
	const isMenuOpen = Boolean(anchorEl);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
	const onClickLogout = () => {
		Cookies.remove('token');
		dispatch<ClearLoginDataActionType>({type: CLEAR_LOGIN_DATA});
		history.replace('/login');
	};

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
	  setAnchorEl(event.currentTarget);
	};
	const user = useSelector<RootReducerType, UserType | undefined>((state) => state.userReducer.user);

	const handleMenuClose = () => {
	  setAnchorEl(null);
	//   handleMobileMenuClose();
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
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
		<MenuItem onClick={handleMenuClose}>{user?.name}</MenuItem>
		<MenuItem onClick={onClickLogout}>Logout</MenuItem>
	  </Menu>


	);
  

	
	// const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const history = useHistory();
	const dispatch = useDispatch();


	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
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
     		 
      		{renderMenu}
			{/* <AppBar position='static' style={{display: 'flex', flexDirection: 'row', alignItems: 'center', boxShadow: 'none', backgroundColor: 'bisque'}}>
				<InputLabel style={{fontSize: '3vw', fontStyle: 'italic', color: 'black', marginLeft: 10}}>{'Swaying ducks library'}</InputLabel>
				<div style={{display: 'flex', flex: 1}} />
				<Button aria-controls="simple-menu" aria-haspopup="menu" onClick={handleClick}>
					<InputLabel style={{fontSize: '3vw', fontWeight: 'bold', color: 'black', marginRight: 10}}>{'Hello ' + user?.name}</InputLabel>
				</Button>
				<Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
					<MenuItem onClick={onClickLogout}>Change password</MenuItem>
					<MenuItem onClick={onClickLogout}>Logout</MenuItem>
				</Menu>
			</AppBar> */}
		</div>
	);
}

export default HomeStudentHeader;
