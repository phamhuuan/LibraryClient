/* tslint:disable */
import React, {FC, useEffect, useState} from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {MainRouteStateType} from "../@types/routes/MainRoute";
import Home from "../components/Home/Home";
import Login from "../components/Login/Login";
import logo from "../assets/logo.jpg";
import mainRouteStyle from "../styles/routes/mainRouteStyle";
import mainStyle from "../styles/mainStyle";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "../@types/reducer";
import {UserType} from "../@types/entity";
import {GET_USER_INFO_FROM_TOKEN} from "../actions/ActionType";

const MainRoute: FC = () => {
	const [state, setState] = useState<MainRouteStateType>({
		needLogin: true,
		loading: true,
	});
	const dispatch = useDispatch();
	const user = useSelector<RootReducerType, UserType | undefined>((state) => state.userReducer.user);
	useEffect(() => {
		try {
			setTimeout(() => {
				if (!user) {
					const token = Cookies.get('token');
					if (!token) {
						setState({loading: false, needLogin: true});
					} else {
						dispatch({type: GET_USER_INFO_FROM_TOKEN, token});
						// setState({loading: false, needLogin: false});
					}
				} else {
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
			<Switch>
				<Route exact path="/">
					{state.needLogin ? <Redirect to="/login" /> : <Home />}
				</Route>
				<Route exact path="/login">
					{state.needLogin ? <Login /> : <Redirect to="/" />}
				</Route>
				<Route exact path="/resetPassword">
					<div>
						<p>Reset Password</p>
					</div>
				</Route>
				<Route path="*">
					<Redirect to="/" />
				</Route>
			</Switch>
		</BrowserRouter>
	);
};

export default MainRoute;
