import {LoginDataBodyType} from "../dataBody";

interface SagaAction {
	type: string;
}

export interface DoLoginSagaAction extends SagaAction {
	dataBody: LoginDataBodyType;
	keepLogin: boolean;
}

export interface DoGetUserInfoFromTokenSagaAction extends SagaAction {
	token: string;
}
