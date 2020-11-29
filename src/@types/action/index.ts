import {AuthorType, GenreType, UserType} from '../entity';

/**
 * Common type
 */
interface ActionType {
	type: string;
}

// action reset message
export interface ResetActionType extends ActionType {
}

export interface FailActionType extends ActionType {
	errorCode: number;
}

/**
 * Login type
 */
export interface LoginSuccessActionType extends ActionType {
	user: UserType;
}

export interface GetUserInforFromTokenActionType extends ActionType {
	token: string;
}

export interface GetUserInforFromTokenSuccessActionType extends ActionType {
	user: UserType;
}

export interface ClearLoginDataActionType extends ActionType {
}

export type LoginReducerActionType = LoginSuccessActionType & ResetActionType & FailActionType & GetUserInforFromTokenSuccessActionType & ClearLoginDataActionType;

/**
 * Get genres type
 */
export interface GetGenresActionType extends ActionType {
}

export interface GetGenresSuccessActionType extends ActionType {
	genres: GenreType[];
}

export type GenresReducerActionType = GetGenresActionType & GetGenresSuccessActionType & FailActionType & ResetActionType;

export interface GetAuthorsByGenreIdActionType extends ActionType {
	genreId: string;
	lastId: string;
	lastName: string;
	limit?: number;
	searchString?: string;
	resetData: boolean;
}

export interface GetAuthorsByGenreIdSuccessActionType extends ActionType {
	authors: AuthorType[];
	hasMore: boolean;
	currentGenreId: string;
	resetData: boolean;
}

export type AuthorsReducerActionType = GetAuthorsByGenreIdSuccessActionType & FailActionType & ResetActionType;
