import {LoginDataBodyType, ResetPasswordDataBodyType, SendResetPasswordEmailDataBodyType, VerifyPasswordDataBodyType} from '../@types/dataBody';
import {TIME_OUT_SERVICE} from './../constants/Constant';
import {getCurrentMillisecond} from '../utils/Utils';
import Axios from 'axios';
import ApiString from '../constants/ApiString';

function *doLoginApi(dataBody: LoginDataBodyType) {
	const config = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		}
	};
	return yield handlePostRequest(ApiString.URL_Login, config, dataBody);
}

function *doGetMyUserInfoFromToken(token: string) {
	const config = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		}
	};
	const url = ApiString.URL_GetMyUserInfoFromToken + '?token=' + token;
	console.log(url);
	return yield handleGetRequest(url, config);
}

function *doSendResetPasswordEmail(dataBody: SendResetPasswordEmailDataBodyType) {
	const config = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	};
	return yield handlePostRequest(ApiString.URL_SendResetPasswordEmail, config, dataBody);
}

const sendResetPasswordEmail = async (dataBody: SendResetPasswordEmailDataBodyType) => {
	const config = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		timeout: 10000,
	};
	return await handlePostRequest2(ApiString.URL_SendResetPasswordEmail, config, dataBody);
}

const verifyPassword = async (dataBody: VerifyPasswordDataBodyType) => {
	const config = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		timeout: 10000,
	};
	return await handlePostRequest2(ApiString.URL_VerifyPassword, config, dataBody);
}

const resetPassword = async (dataBody: ResetPasswordDataBodyType) => {
	const config = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		timeout: 10000,
	};
	return await handlePostRequest2(ApiString.URL_ResetPassword, config, dataBody);
}

function timeout(ms: number, promise: Promise<any>) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			reject(new Error("timeout"));
		}, ms);
		promise.then(resolve, reject);
	});
}

//function dùng để request lên server theo method POST
function* handlePostRequest(urlApi: string, config: any, dataBody: any) {
	console.log('Url', urlApi, 'config', config, 'body', dataBody);
	let startTime = getCurrentMillisecond();
	let endTime = 0;
	return yield timeout(
		TIME_OUT_SERVICE,
		Axios.post(urlApi, dataBody, config)
	).then(response => {
		endTime = getCurrentMillisecond();
		console.log('Timer', (endTime - startTime), "url", urlApi, 'response', response);
		return response;
	}).catch(error => {
		console.log("Api handlePostRequest error: " + error);
		return null;
	});
}

const handlePostRequest2 = async (urlApi: string, config: any, dataBody: any) => {
	try {
		let startTime = getCurrentMillisecond(), endTime = 0;
		const response = await Axios.create().post(urlApi, dataBody, config);
		endTime = getCurrentMillisecond();
		console.log('Timer', (endTime - startTime), "url", urlApi, 'response', response);
		return response;
	} catch (error) {
		console.log("Api handlePostRequest error: " + error);
		return null;
	}
}

//function dùng để request lên server theo method GET
function* handleGetRequest(urlApi: string, config: any) {
	console.log('Url', urlApi, 'config', config);
	let startTime = getCurrentMillisecond();
	let endTime = 0;
	return yield timeout(
		TIME_OUT_SERVICE,
		Axios.get(urlApi, config)
	).then(response => {
		endTime = getCurrentMillisecond();
		console.log('Timer', (endTime - startTime), "url", urlApi, 'response', response);
		return response;
	}).catch(error => {
		console.log("Api handleGetRequest error: " + error);
		return null;
	});
}

const Api = {
	doLoginApi,
	doGetMyUserInfoFromToken,
	doSendResetPasswordEmail,
	sendResetPasswordEmail,
	verifyPassword,
	resetPassword,
};

export default Api;
