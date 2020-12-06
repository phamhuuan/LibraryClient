import Cookies from 'js-cookie';
import {LoginDataBodyType, ResetPasswordDataBodyType, SendResetPasswordEmailDataBodyType, VerifyPasswordDataBodyType} from '../@types/dataBody';
import {TIME_OUT_SERVICE} from './../constants/Constant';
import {getCurrentMillisecond} from '../utils/Utils';
import Axios, { AxiosRequestConfig } from 'axios';
import ApiString from '../constants/ApiString';

function* doLoginApi(dataBody: LoginDataBodyType) {
	const config = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		}
	};
	return yield handlePostRequest(ApiString.URL_Login, config, dataBody);
}

function* doGetMyUserInfoFromToken(token: string) {
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		}
	};
	const url: string = ApiString.URL_GetMyUserInfoFromToken + '?token=' + token;
	return yield handleGetRequest(url, config);
}

function* doSendResetPasswordEmail(dataBody: SendResetPasswordEmailDataBodyType) {
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	};
	return yield handlePostRequest(ApiString.URL_SendResetPasswordEmail, config, dataBody);
}

function* doGetAllGenres() {
	const token = Cookies.get('token');
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: 'Bearer ' + token,
		}
	};
	return yield handleGetRequest(ApiString.URL_GetAllGenres, config);
}

function* doGetAuthorsByGenreId(genreId: string, lastId: string, lastName: string, limit?: number, regex?: string) {
	const token = Cookies.get('token');
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: 'Bearer ' + token,
		},
		timeout: 10000,
	};
	let url: string = ApiString.URL_GetAuthorsByGenreId + '?genreId=' + genreId;
	url += '&lastId=' + lastId;
	url += '&lastName=' + lastName;
	if (limit) {
		url += '&limit=' + limit;
	}
	if (regex) {
		url += '&regex=' + regex;
	}
	return yield handleGetRequest(url, config);
}

//

const sendResetPasswordEmail = async (dataBody: SendResetPasswordEmailDataBodyType) => {
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		timeout: 10000,
	};
	return await handlePostRequest2(ApiString.URL_SendResetPasswordEmail, config, dataBody);
}

const verifyPassword = async (dataBody: VerifyPasswordDataBodyType) => {
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		timeout: 10000,
	};
	return await handlePostRequest2(ApiString.URL_VerifyPassword, config, dataBody);
}

const resetPassword = async (dataBody: ResetPasswordDataBodyType) => {
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		timeout: 10000,
	};
	return await handlePostRequest2(ApiString.URL_ResetPassword, config, dataBody);
}

const getAuthorInfo = async (authorId: string) => {
	const token = Cookies.get('token');
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: 'Bearer ' + token,
		},
		timeout: 10000,
	};
	const url = `${ApiString.URL_GetAuthorInfo}?authorId=${authorId}`;
	return await handleGetRequest2(url, config);
}

const getBooks = async (searchString: string, page: number) => {
	const token = Cookies.get('token');
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: 'Bearer ' + token,
		},
		timeout: 10000,
	};
	const url = `${ApiString.URL_GetBooks}?searchString=${searchString}&page=${page}`;
	return await handleGetRequest2(url, config);
}

const getBookInfo = async (bookId: string) => {
	const token = Cookies.get('token');
	const config: AxiosRequestConfig = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: 'Bearer ' + token,
		},
		timeout: 10000,
	};
	const url = `${ApiString.URL_GetBookInfo}?bookId=${bookId}`;
	return await handleGetRequest2(url, config);
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
function* handlePostRequest(urlApi: string, config: AxiosRequestConfig, dataBody: any) {
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

const handlePostRequest2 = async (urlApi: string, config: AxiosRequestConfig, dataBody: any) => {
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
function* handleGetRequest(urlApi: string, config: AxiosRequestConfig) {
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

const handleGetRequest2 = async (urlApi: string, config: AxiosRequestConfig) => {
	try {
		let startTime = getCurrentMillisecond(), endTime = 0;
		const response = await Axios.create().get(urlApi, config);
		endTime = getCurrentMillisecond();
		console.log('Timer', (endTime - startTime), "url", urlApi, 'response', response);
		return response;
	} catch (error) {
		console.log("Api handlePostRequest error: " + error);
		return null;
	}
}

const Api = {
	doLoginApi,
	doGetMyUserInfoFromToken,
	doSendResetPasswordEmail,
	doGetAllGenres,
	doGetAuthorsByGenreId,
	sendResetPasswordEmail,
	verifyPassword,
	resetPassword,
	getAuthorInfo,
	getBooks,
	getBookInfo,
};

export default Api;
