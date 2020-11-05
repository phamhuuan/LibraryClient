export interface ResetPasswordComponentStateType {
	token: string;
	showPasswordField: boolean;
	showNewPasswordField: boolean;
	showCounting: boolean;
	timeLeft: number;
}

export interface LoginNumberStateType{
	value: number;
	size: number;
	color: string;
	login: string;
}
export interface setInputStateType{
	size: number;
	color: string;
}
