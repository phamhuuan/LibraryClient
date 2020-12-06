export interface LoginDataBodyType {
	email: string;
	password: string;
}

export interface SendResetPasswordEmailDataBodyType {
	email: string;
}

export interface VerifyPasswordDataBodyType {
	email: string;
	password: string;
	token: string;
}

export interface ResetPasswordDataBodyType {
	email: string;
	password: string;
	newPassword: string;
}