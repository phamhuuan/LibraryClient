// const PREFIX = 'https://library-sevice.herokuapp.com';
const PREFIX = 'http://localhost:4000';

const ApiString = {
	URL_Login: PREFIX + '/login',
	URL_GetMyUserInfoFromToken: PREFIX + '/myUserInfo',
	URL_SendResetPasswordEmail: PREFIX + '/sendResetPasswordEmail',
	URL_VerifyPassword: PREFIX + '/verifyPassword',
	URL_ResetPassword: PREFIX + '/resetPassword',
	URL_GetAllGenres: PREFIX + '/getGenres',
	URL_GetAuthorsByGenreId: PREFIX + '/getAuthorByGenreId',
	URL_GetAuthorInfo: PREFIX + '/getAuthorInfo',
	URL_GetBooks: PREFIX + '/getBooks',
	URL_GetBookInfo: PREFIX + '/getBookInfo',
	URL_CreateGenre: PREFIX + '/genre/new',
	URL_CreateAuthor: PREFIX + '/author/new',
	URL_EditAuthor: PREFIX + '/author/edit',
	URL_SearchAuthor: PREFIX + '/author/search',
	URL_EditBook: PREFIX + '/book/edit',
	URL_SearchGenre: PREFIX + '/genre/search',
	URL_CreateBook: PREFIX + '/book/new',
	URL_BorrowBook: PREFIX + '/book/borrow/new',
	URL_GetUserByStudentId: PREFIX + '/user/getByStudentId',
};

export default ApiString;