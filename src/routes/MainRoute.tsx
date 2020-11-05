/* tslint:disable */
import React, {FC, lazy, Suspense, useEffect, useState} from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {MainRouteStateType} from "../@types/routes/MainRoute";
import Home from "../components/Home/Home";
// import Login from "../components/Login/Login";
import logo from "../assets/logo.jpg";
import mainRouteStyle from "../styles/routes/mainRouteStyle";
import mainStyle from "../styles/mainStyle";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "../@types/reducer";
import {UserType} from "../@types/entity";
import {GET_USER_INFO_FROM_TOKEN} from "../actions/ActionType";
import ResetPassword from "../components/ResetPassword/ResetPassword";

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
	useEffect(() => {
		// kiem tra xem da dang nhap hay chua, neu chua thi hien form dang nhap
		try {
			setTimeout(() => {
				// kiem tra thong tin ve user trong store
				if (!user) {
					// neu khong co thi kiem tra token luu trong cookie
					const token = Cookies.get('token');
					if (!token) {
						// neu khong co trong cookie thi hien form login
						setState({loading: false, needLogin: true});
					} else {
						// neu co thi luu thong tin vao store
						dispatch({type: GET_USER_INFO_FROM_TOKEN, token});
						// setState({loading: false, needLogin: false});
					}
				} else {
					// neu co thi tiep tuc vao trang muon vao
					setState({loading: false, needLogin: false});
				}
			}, 0);
		} catch (error) {
			console.log("error", error);
		}
	}, [dispatch, user]);
	if (state.loading) {
		return (
			<div style={{...mainRouteStyle.logoDiv, ...mainStyle.fullScreen}}>
				<img alt={"Logo"} src={logo}></img>
			</div>
		);
	}
	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route exact path="/">
						{state.needLogin ? <Redirect to="/login" /> : <Home />}
					</Route>
					<Route exact path="/login">
						{state.needLogin ? <Login /> : <Redirect to="/" />}
					</Route>
					<Route exact path="/resetPassword">
						{state.needLogin ? <ResetPassword /> : <Redirect to="/" />}
					</Route>
					<Route path="*">
						<Redirect to="/" />
					</Route>
				</Switch>
			</Suspense>
		</BrowserRouter>
	);
};

export default MainRoute;
