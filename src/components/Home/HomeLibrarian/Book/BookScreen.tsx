import React, {ChangeEvent, ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import CustomModal from '../../../Common/CustomModal';
import Loading from '../../../Common/Loading';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useParams, useHistory} from 'react-router-dom';
import Api from '../../../../sagas/api';
import {OK} from '../../../../constants/Constant';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Carousel} from 'react-responsive-carousel';
import {AuthorType, BookResponseType} from '../../../../@types/entity';
import {Button, IconButton} from '@material-ui/core';
import {checkValidURL, parseDate} from '../../../../utils/Utils';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInput from '../../../Common/TextInput';
import {Delete, AddCircleOutline} from '@material-ui/icons';
import ERROR_CODE from '../../../../constants/ErrorCode';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			width: '100%',
			height: '100%',
		},
	}),
);

const BookScreen: FC = () => {
	const style = useStyles();
	type ModalHandleType = ElementRef<typeof CustomModal>;
	type TextInputHandleType = ElementRef<typeof TextInput>;
	const addImageInputRef = useRef<TextInputHandleType>(null);
	const loadingModalRef = useRef<ModalHandleType>(null);
	type ParamsType = {
		bookId: string;
	}
	const {bookId}: ParamsType = useParams();
	const [book, setBook] = useState<BookResponseType | undefined>(undefined);
	const [book2, setBook2] = useState<BookResponseType | undefined>(undefined);
	const [suggestAuthor, setSuggestAuthor] = useState<AuthorType[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');
	const history = useHistory();
	const [isShowEditBookView, setIsShowEditBookView] = useState<boolean>(false);

	const setPublishDateValue = useCallback((date: MaterialUiPickersDate) => {
		if (date && book) {
			setBook({...book, publishDate: date.toString()});
		}
	}, [book]);

	const setLocationValue = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (book) {
			setBook({...book, location: parseInt(event.target.value, 10)});
		}
	}, [book]);

	const setAmountValue = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (book) {
			setBook({...book, amount: parseInt(event.target.value, 10)});
		}
	}, [book]);

	const setNameValue = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (book) {
			setBook({...book, name: event.target.value});
		}
	}, [book]);

	const getBookInfo = useCallback(async () => {
		const result = await Api.getBookInfo(bookId);
		if (result && result.status === 200) {
			if (result.data.status === OK) {
				setBook(result.data.book);
				setBook2(result.data.book);
			} else {
				toast('Network error', {type: 'error'});
			}
		}
	}, [bookId]);

	useEffect(() => {
		loadingModalRef.current?.closeModal();
		getBookInfo();
	}, [getBookInfo]);

	const loadingModal = useMemo((): ReactNode => (
		<CustomModal ref={loadingModalRef} open className={style.paper}>
			<Loading />
		</CustomModal>
	), [style.paper]);

	const goBack = useCallback((): void => {
		history.goBack();
	}, [history]);

	const openEditForm = () => {
		setIsShowEditBookView(true);
	};

	const closeEditForm = useCallback(() => {
		setIsShowEditBookView(false);
		setBook(book2);
	}, [book2]);

	const saveBookInfo = useCallback(async () => {
		const response = await Api.editBook(book);
		if (response && response.status === 200) {
			if (response.data.status === OK) {
				setIsShowEditBookView(false);
				setBook2(book);
				toast('Update book success!', {type: 'success'});
			} else {
				if (response.data.errorCode === ERROR_CODE.UPDATE_BOOK_ERROR.BOOK_NOT_FOUND) {
					goBack();
					toast('Book not found!', {type: 'error'});
				} else {
					toast('Network error', {type: 'error'});
				}
			}
		} else {
			toast('Network error', {type: 'error'});
		}
	}, [book, goBack]);

	const deleteImage = useCallback((index: number) => {
		if (book) {
			let images = book.images;
			images.splice(index, 1);
			setBook({...book, images});
		}
	}, [book]);

	const deleteAuthor = useCallback((index: number) => {
		if (book) {
			let authorIdArr = book.authorIdArr;
			let authors = book.authors;
			authorIdArr.splice(index, 1);
			authors.splice(index, 1);
			setBook({...book, authorIdArr, authors});
		}
	}, [book]);

	const addImage = useCallback(() => {
		if (addImageInputRef.current) {
			if (checkValidURL(addImageInputRef.current.getTextInputState().value.trim())) {
				if (book) {
					let images = book.images;
					images.push(addImageInputRef.current.getTextInputState().value.trim());
					addImageInputRef.current.setTextInputState({value: ''});
					setBook({...book, images});
				}
			} else {
				toast('You must enter a valid image url!', {type: 'warning'});
			}
		}
	}, [book]);

	const addAuthor = useCallback((author: AuthorType) => {
		if (book) {
			let authorIdArr = book.authorIdArr;
			let authors = book.authors;
			authorIdArr.push(author.authorId);
			authors.push(author);
			setBook({...book, authors, authorIdArr});
			setSearchValue('');
		}
	}, [book]);

	const searchAuthor = useCallback(async () => {
		if (book && searchValue !== '') {
			const response = await Api.searchAuthor(searchValue, book.genreId, book.authorIdArr);
			if (response && response.status === 200) {
				if (response.data.status === OK) {
					setSuggestAuthor(response.data.authors);
				}
			}
		} else {
			setSuggestAuthor([]);
		}
	}, [book, searchValue]);

	useEffect(() => {
		searchAuthor();
	}, [searchAuthor])

	const updateSearchValue = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setSearchValue(event.target.value);
	};

	const backButton = useMemo((): ReactNode => (
		<div style={{display: 'flex', flexDirection: 'row'}}>
			{!isShowEditBookView ? <Button onClick={goBack} style={{fontSize: 20}}>Back</Button> : <Button onClick={closeEditForm} style={{fontSize: 20}}>Cancel</Button>}
			<div style={{flex: 1}} />
			{!isShowEditBookView ? <Button onClick={openEditForm} style={{fontSize: 20}}>Edit</Button> : <Button onClick={saveBookInfo} style={{fontSize: 20}}>Save</Button>}
		</div>
	), [closeEditForm, goBack, isShowEditBookView, saveBookInfo]);

	const bookInfo = useMemo((): ReactNode => {
		if (book) {
			return (
				<div style={{marginLeft: 20, marginRight: 20}}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						{!isShowEditBookView ? <p style={{fontSize: 40}}>{book.name}</p> : <TextInput label={''} value={book.name} placeholder={'Book name'} onChange={setNameValue} />}
					</div>
					<div>
						<>
							<strong>1. Genre:</strong> {book.genre[0].name}
							<br />
							<strong>2. Publish date:</strong> {!isShowEditBookView ? parseDate(book.publishDate) : <div style={{width: 200, marginRight: 20}}>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<KeyboardDatePicker
										margin="normal"
										id="date-picker-dialog"
										label="Choose publish date"
										format="dd/MM/yyyy"
										value={book?.publishDate}
										onChange={setPublishDateValue}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
									/>
								</MuiPickersUtilsProvider>
							</div>}
							<br />
							<strong>3. Location:</strong> Room {!isShowEditBookView ? book.location : <TextInput label={''} value={book.location.toString()} type={'number'} placeholder={'Room number'} onChange={setLocationValue} />}
							<br />
							<strong>4. Amount:</strong> {!isShowEditBookView ? book.amount : <TextInput label={''} value={book.amount.toString()} type={'number'} placeholder={'Book amount'} onChange={setAmountValue} />}
							<br />
							<strong>5. Authors:</strong>
							{!isShowEditBookView ? book.authors.map((author) => (
								<li key={author._id}>{author.name}</li>
							)) : <div>
								{book.authors.map((author, index: number) => (
									<div key={index} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
										{author.name}
										<IconButton aria-label={'delete'} onClick={() => deleteAuthor(index)}>
											<Delete />
										</IconButton>
									</div>
								))}
								<TextInput value={searchValue} label={''} placeholder={'Enter author name'} onChange={updateSearchValue} />
								<div style={{display: 'flex', flexDirection: 'column'}}>
									{suggestAuthor.map((author, index) => <div onClick={() => addAuthor(author)} key={index}>
										{author.name}
									</div>)}
								</div>
							</div>}
							<strong>6. Images:</strong>
						</>
					</div>
					<div>
						{!isShowEditBookView ? <Carousel autoPlay infiniteLoop interval={5000}>
							{book.images.map((image, index) => <img key={index} alt={book.name} src={image} />)}
						</Carousel> : <div style={{display: 'flex', flexDirection: 'column'}}>
							{book.images.map((image, index) => <div key={index}>
								<img style={{height: 40, width: 40}} src={image} alt={''} />
								<IconButton aria-label={'delete'} onClick={() => deleteImage(index)}>
									<Delete />
								</IconButton>
							</div>)}
							<div style={{display: 'flex', flexDirection: 'row'}}>
								<TextInput ref={addImageInputRef} label={''} placeholder={'Enter image url'} />
								<IconButton onClick={addImage}>
									<AddCircleOutline />
								</IconButton>
							</div>
						</div>}
					</div>
					<div style={{height: 20}} />
				</div>
			);
		}
		return <div />;
	}, [book, isShowEditBookView, setNameValue, setPublishDateValue, setLocationValue, setAmountValue, searchValue, suggestAuthor, addImage, deleteAuthor, addAuthor, deleteImage]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto'}}>
			{backButton}
			{bookInfo}
			{loadingModal}
			<ToastContainer />
		</div>
	)
};

export default BookScreen;
