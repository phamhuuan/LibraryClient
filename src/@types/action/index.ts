import {UserType} from '../entity';

interface ActionType {
	type: string;
}


export interface ResetActionType extends ActionType {
}

export interface FailActionType extends ActionType {
	errorCode: number;
}

export interface LoginSuccessActionType extends ActionType {
	user: UserType,
}

export interface GetUserInforFromTokenSuccessActionType extends ActionType {
	user: UserType,
}

export interface PlusNumber extends ActionType{
      value: number;
}
export interface MinusNumber extends ActionType{

}
export interface ResetNumber extends ActionType{
	
}
export interface SetAttribute extends ActionType{
	color: string;
	size: number;
}