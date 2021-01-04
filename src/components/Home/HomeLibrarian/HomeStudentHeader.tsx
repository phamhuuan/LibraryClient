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
import {ClearLoginDataActionType} from '../../../@types/action';

const HomeStudentHeader: FC = () => {
	const user = useSelector<RootReducerType, UserType | undefined>((state) => state.userReducer.user);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const history = useHistory();
	const dispatch = useDispatch();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const onClickLogout = () => {
		Cookies.remove('token');
		dispatch<ClearLoginDataActionType>({type: CLEAR_LOGIN_DATA});
		history.replace('/login');
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<AppBar position='static' style={{display: 'flex', flexDirection: 'row', alignItems: 'center', boxShadow: 'none', backgroundColor: '#e6f7ff'}}>
				<InputLabel style={{fontSize: 18, fontStyle: 'italic', color: 'black', marginLeft: 10}}>{'Swaying ducks library'}</InputLabel>
				<div style={{display: 'flex', flex: 1}} />
				<Button aria-controls="simple-menu" aria-haspopup="menu" onClick={handleClick}>
					<InputLabel style={{fontSize: 18, fontWeight: 'bold', color: 'black', marginRight: 10}}>{'Hello ' + user?.name}</InputLabel>
				</Button>
				<Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
					<MenuItem onClick={onClickLogout}>Change password</MenuItem>
					<MenuItem onClick={onClickLogout}>Logout</MenuItem>
				</Menu>
			</AppBar>
		</div>
	);
}

export default HomeStudentHeader;
