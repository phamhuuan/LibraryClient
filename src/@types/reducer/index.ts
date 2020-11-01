import {UserType} from '../entity';

export interface UserReducerStateType {
	user?: UserType,
	loginMessage: string,
	loginErrorCode: number | undefined,
	getUserInfoFromTokenMessage: string,
	getUserInfoFromTokenErrorCode: number | undefined,
}
export interface CountReducerStateType{
	number: number
}
export interface RootReducerType {
	userReducer: UserReducerStateType;
	countReducer: CountReducerStateType;
}