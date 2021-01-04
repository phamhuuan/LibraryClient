import {Button} from '@material-ui/core';
import React, {ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef} from 'react';
import {OK} from '../../../../constants/Constant';
import Api from '../../../../sagas/api';
import TextInput from '../../../Common/TextInput';
import CustomModal from '../../../Common/CustomModal';
import Loading from '../../../Common/Loading';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import PathName from '../../../../constants/PathName';
import {useDispatch, useSelector} from 'react-redux';
import {BooksReducerStateType, RootReducerType} from '../../../../@types/reducer';
import {BookResponseType} from '../../../../@types/entity';
import {GetBooksSuccessActionType} from '../../../../@types/action';
import {GET_BOOKS_SUCCESS} from '../../../../actions/ActionType';
import {parseDate} from '../../../../utils/Utils';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			width: '100%',
			height: '100%',
		},
	}),
);

const SearchScreen: FC = () => {
	const style = useStyles();
	type TextInputHandleType = ElementRef<typeof TextInput>;
	const searchInputRef = useRef<TextInputHandleType>(null);
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const loadingModalRef = useRef<ModalHandleType>(null);
	const booksReducerState = useSelector<RootReducerType, BooksReducerStateType>((state) => state.booksReducer);
	const history = useHistory();
	const dispatch = useDispatch();

	useEffect(() => {
		loadingModalRef.current?.closeModal();
		searchInputRef.current?.setTextInputState({value: booksReducerState.searchString});
	}, [booksReducerState.searchString]);

	const onSearch = useCallback(async (page: number): Promise<void> => {
		loadingModalRef.current?.openModal();
		const response = await Api.getBooks(searchInputRef.current?.getTextInputState().value || '', page);
		loadingModalRef.current?.closeModal();
		if (response && response.data) {
			if (response.data.status === OK) {
				dispatch<GetBooksSuccessActionType>({
					type: GET_BOOKS_SUCCESS,
					books: response.data.books,
					currentPage: page,
					totalPage: response.data.totalPage,
					searchString: searchInputRef.current?.getTextInputState().value || ''
				});
			} else {
				toast('Network error', {type: 'error'});
			}
		} else {
			toast('Network error', {type: 'error'});
		}
	}, [dispatch]);

	const inputView = useMemo((): ReactNode => (
		<div style={{display: 'flex', flexDirection: 'row'}}>
			<div style={{marginLeft: 16, marginRight: 16, flex: 1}}>
				<TextInput ref={searchInputRef} placeholder={'Enter book name'} label={''} style={{width: '100%'}} />
			</div>
			<div>
				<Button onClick={() => onSearch(1)}>Search</Button>
			</div>
		</div>
	), [onSearch]);

	const switchPageView = useMemo((): ReactNode => {
		if (booksReducerState.totalPage > 0) {
			return (
				<div style={{display: 'flex', flexDirection: 'row'}}>
					<Button disabled={booksReducerState.currentPage === 1} onClick={() => onSearch(booksReducerState.currentPage - 1)}>Previous page</Button>
					<div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
						<p>Page {booksReducerState.currentPage}/{booksReducerState.totalPage}</p>
					</div>
					<Button disabled={booksReducerState.currentPage === booksReducerState.totalPage} onClick={() => onSearch(booksReducerState.currentPage + 1)}>Next page</Button>
				</div>
			);
		}
		return <div />;
	}, [booksReducerState.currentPage, onSearch, booksReducerState.totalPage]);

	const goToDetail = useCallback((bookId: string) => {
		history.push(PathName.Book + '/' + bookId);
	}, [history]);

	const listBookView = useMemo((): ReactNode => (
		<div style={{overflowY: 'auto', marginBottom: 10}}>
			{booksReducerState.data.map((book: BookResponseType) => (
				<div key={book._id} style={{borderRadius: 16, backgroundColor: '#e7e7e7', marginTop: 10, padding: 10}}>
					<p>
						<strong>Title:</strong> {book.name}
						<br />
						<strong>Genre:</strong> {book.genre[0].name}
						<br />
						<strong>Publish date:</strong> {parseDate(book.publishDate)}
						<br />
						<strong>Location:</strong> Room {book.location}
						<br />
						<strong>Amount:</strong> {book.amount}
						<br />
						<strong>Authors:</strong>
						{book.authors.map((author) => (
							<li key={author._id}>{author.name}</li>
						))}
					</p>
					<Button onClick={() => goToDetail(book._id)}>
						<u>Go to detail</u>
					</Button>
				</div>
			))}
		</div>
	), [goToDetail, booksReducerState.data]);

	const loadingModal = useMemo((): ReactNode => (
		<CustomModal ref={loadingModalRef} open className={style.paper}>
			<Loading />
		</CustomModal>
	), [style.paper]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
			{inputView}
			{booksReducerState.data.length === 0 && <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'gray'}}>No result</div>}
			{switchPageView}
			{listBookView}
			{loadingModal}
			<ToastContainer />
		</div>
	)
};

export default SearchScreen;
