// const PREFIX = 'https://library-sevice.herokuapp.com';
const PREFIX = 'http://localhost:4000';

const ApiString = {
	URL_Login: PREFIX + '/login',
	URL_GetMyUserInfoFromToken: PREFIX + '/myUserInfo',
	URL_SendResetPasswordEmail: PREFIX + '/sendResetPasswordEmail',
	URL_VerifyPassword: PREFIX + '/verifyPassword',
	URL_ResetPassword: PREFIX + '/resetPassword',
};

export default ApiString;