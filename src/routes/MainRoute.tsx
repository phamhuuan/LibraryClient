/* tslint:disable */
import React, {FC, lazy, Suspense, useEffect, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {MainRouteStateType} from '../@types/routes/MainRoute';
import Home from '../components/Home/Home';
import logo from '../assets/logo.jpg';
import mainRouteStyle from '../styles/routes/mainRouteStyle';
import mainStyle from '../styles/mainStyle';
import Cookies from 'js-cookie';
import {useDispatch, useSelector} from 'react-redux';
import {RootReducerType} from '../@types/reducer';
import {UserType} from '../@types/entity';
import {GET_USER_INFO_FROM_TOKEN} from '../actions/ActionType';
import ResetPassword from '../components/ResetPassword/ResetPassword';
import PathName from '../constants/PathName';
import {GetUserInforFromTokenActionType} from '../@types/action';
import Loading from '../components/Common/Loading';

const Login = lazy(() => import('../components/Login/Login'));

const MainRoute: FC = () => {
	const [state, setState] = useState<MainRouteStateType>({
		needLogin: true,
		loading: true,
	});
	// dung de dispatch 1 action cua redux
	const dispatch = useDispatch();
	// dung de lay du lieu tu trong store cua redux
	const user = useSelector<RootReducerType, UserType | undefined>((state) => state.userReducer.user);
	const getUserInfoFromTokenErrorCode = useSelector<RootReducerType, number | undefined>((state) => state.userReducer.getUserInfoFromTokenErrorCode);

	useEffect(() => {
		// kiem tra xem da dang nhap hay chua, neu chua thi hien form dang nhap
		// kiem tra thong tin ve user trong store
		if (!user) {
			// neu khong co thi kiem tra token luu trong cookie
			const token = Cookies.get('token');
			if (!token) {
				// neu khong co trong cookie thi hien form login
				setState({loading: false, needLogin: true});
			} else {
				// neu co thi luu thong tin vao store
				dispatch<GetUserInforFromTokenActionType>({type: GET_USER_INFO_FROM_TOKEN, token});
				// setState({loading: false, needLogin: false});
			}
		} else {
			// neu co thi tiep tuc vao trang muon vao
			setState({loading: false, needLogin: false});
		}
	}, [dispatch, user]);

	// kiem tra xem neu get token error => go to login
	useEffect(() => {
		if (getUserInfoFromTokenErrorCode) {
			Cookies.remove('token');
			setState({needLogin: true, loading: false});
		}
	}, [getUserInfoFromTokenErrorCode]);
	if (state.loading) {
		return (
			<div style={{...mainRouteStyle.logoDiv, ...mainStyle.fullScreen}}>
				<img alt={'Logo'} src={logo}></img>
			</div>
		);
	}
	return (
		<BrowserRouter>
			<Suspense fallback={<Loading />}>
				<Switch>
					<Route exact path={PathName.Home}>
						{state.needLogin ? <Redirect to={PathName.Login} /> : <Home />}
					</Route>
					<Route exact path={PathName.Search}>
						{state.needLogin ? <Redirect to={PathName.Login} /> : <Home />}
					</Route>
					<Route exact path={PathName.Borrowed}>
						{state.needLogin ? <Redirect to={PathName.Login} /> : <Home />}
					</Route>
					<Route exact path={PathName.Authors}>
						{state.needLogin ? <Redirect to={PathName.Login} /> : <Home />}
					</Route>
					<Route exact path={PathName.Authors + '/:genreId'}>
						{state.needLogin ? <Redirect to={PathName.Login} /> : <Home />}
					</Route>
					<Route exact path={PathName.Authors + '/:genreId/:authorId'}>
						{state.needLogin ? <Redirect to={PathName.Login} /> : <Home />}
					</Route>
					<Route exact path={PathName.Book + '/:bookId'}>
						{state.needLogin ? <Redirect to={PathName.Login} /> : <Home />}
					</Route>
					<Route exact path={PathName.BorrowBook}>
						{state.needLogin ? <Redirect to={PathName.Login} /> : <Home />}
					</Route>
					<Route exact path={PathName.Login}>
						{state.needLogin ? <Login /> : <Redirect to={PathName.Home} />}
					</Route>
					<Route exact path={PathName.ResetPassword}>
						{state.needLogin ? <ResetPassword /> : <Redirect to={PathName.Home} />}
					</Route>
					<Route path='*'>
						<Redirect to={PathName.Home} />
					</Route>
				</Switch>
			</Suspense>
		</BrowserRouter>
	);
};

export default MainRoute;
