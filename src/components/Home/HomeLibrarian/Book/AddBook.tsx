import React, {ChangeEvent, ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInput from '../../../Common/TextInput';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import {Button, IconButton} from '@material-ui/core';
import {Delete, AddCircleOutline} from '@material-ui/icons';
import {AuthorType, GenreType} from '../../../../@types/entity';
import {checkValidURL} from '../../../../utils/Utils';
import Api from '../../../../sagas/api';
import {OK} from '../../../../constants/Constant';

const AddBook: FC = () => {
	type TextInputHandleType = ElementRef<typeof TextInput>;
	const addImageInputRef = useRef<TextInputHandleType>(null);
	const bookNameInputRef = useRef<TextInputHandleType>(null);
	const roomInputRef = useRef<TextInputHandleType>(null);
	const amountInputRef = useRef<TextInputHandleType>(null);
	const [selectedDate, setSelectedDate] = useState<MaterialUiPickersDate>(new Date());
	const [authors, setAuthors] = useState<AuthorType[]>([]);
	const [suggestAuthor, setSuggestAuthor] = useState<AuthorType[]>([]);
	const [suggestGenre, setSuggestGenre] = useState<GenreType[]>([]);
	const [genre, setGenre] = useState<GenreType | undefined>(undefined);
	const [searchValue, setSearchValue] = useState<string>('');
	const [searchValue2, setSearchValue2] = useState<string>('');
	const [images, setImages] = useState<string[]>([]);

	const deleteImage = useCallback((index: number) => {
		images.splice(index, 1);
		setImages([...images]);
	}, [images]);

	const deleteAuthor = useCallback((index: number) => {
		authors.splice(index, 1);
		setAuthors([...authors]);
	}, [authors]);

	const addImage = useCallback(() => {
		if (addImageInputRef.current) {
			if (checkValidURL(addImageInputRef.current.getTextInputState().value.trim())) {
				images.push(addImageInputRef.current.getTextInputState().value.trim());
				addImageInputRef.current.setTextInputState({value: ''});
				setImages([...images]);
			} else {
				toast('You must enter a valid image url!', {type: 'warning'});
			}
		}
	}, [images]);

	const addAuthor = useCallback((author: AuthorType) => {
		authors.push(author);
		setAuthors([...authors]);
		setSearchValue('');
	}, [authors]);

	const searchAuthor = useCallback(async () => {
		if (searchValue !== '' && genre) {
			try {
				new RegExp(searchValue, 'i');
				const response = await Api.searchAuthor(searchValue, genre.genreId, authors.map((author) => author.authorId));
				if (response && response.status === 200) {
					if (response.data.status === OK) {
						setSuggestAuthor(response.data.authors);
					}
				}
			} catch (e) {}
		} else {
			setSuggestAuthor([]);
		}
	}, [authors, genre, searchValue]);

	const searchGenre = useCallback(async () => {
		if (searchValue2 !== '') {
			try {
				new RegExp(searchValue2, 'i');
				const response = await Api.searchGenre(searchValue2);
				if (response && response.status === 200) {
					if (response.data.status === OK) {
						setSuggestGenre(response.data.genres);
					}
				}
			} catch (e) {}
		} else {
			setSuggestGenre([]);
		}
	}, [searchValue2]);

	useEffect(() => {
		searchAuthor();
	}, [searchAuthor]);

	useEffect(() => {
		searchGenre();
	}, [searchGenre]);

	const updateSearchValue = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setSearchValue(event.target.value);
	};

	const updateSearchValue2 = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setSearchValue2(event.target.value);
	};

	const addGenre = (genre: GenreType) => {
		setGenre(genre);
		setSearchValue2('');
	};

	const bookInfo = useMemo((): ReactNode => {
		return (
			<div style={{marginLeft: 20, marginRight: 20}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<TextInput ref={bookNameInputRef} label={''} placeholder={'Book name'} />
				</div>
				<div>
					<>
						<strong>1. Genre:</strong> {genre?.name}
						<TextInput value={searchValue2} label={''} placeholder={'Enter genre name'} onChange={updateSearchValue2} />
						<div style={{display: 'flex', flexDirection: 'column'}}>
							{suggestGenre.map((genre: GenreType, index: number) => <div onClick={() => addGenre(genre)} key={index}>
								{genre.name}
							</div>)}
						</div>
						<br />
						<strong>2. Publish date:</strong> <div style={{width: 200, marginRight: 20}}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									margin="normal"
									id="date-picker-dialog"
									label="Choose publish date"
									format="dd/MM/yyyy"
									value={selectedDate}
									onChange={setSelectedDate}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
								/>
							</MuiPickersUtilsProvider>
						</div>
						<br />
						<strong>3. Location:</strong> Room <TextInput ref={roomInputRef} label={''} type={'number'} placeholder={'Room number'} />
						<br />
						<strong>4. Amount:</strong> <TextInput ref={amountInputRef} label={''} type={'number'} placeholder={'Book amount'} />
						<br />
						<strong>5. Authors:</strong>
						<div>
							{authors.map((author, index: number) => (
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
						</div>
						<strong>6. Images:</strong>
					</>
				</div>
				<div>
					<div style={{display: 'flex', flexDirection: 'column'}}>
						{images.map((image, index) => <div key={index}>
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
					</div>
				</div>
				<div style={{height: 20}} />
			</div>
		);
	}, [addAuthor, addImage, authors, deleteAuthor, deleteImage, genre, images, searchValue, searchValue2, selectedDate, suggestAuthor, suggestGenre]);

	const addBook = useCallback(async () => {
		if (!bookNameInputRef.current || bookNameInputRef.current.getTextInputState().value.trim() === '') {
			toast('Book name should not be an empty string!', {type: 'error'});
			return;
		}
		if (!genre) {
			toast('Book genre should not be an empty string!', {type: 'error'});
			return;
		}
		if (authors.length === 0) {
			toast('Book must have at least 1 author!', {type: 'error'});
			return;
		}
		if (images.length === 0) {
			toast('Book must have at least 1 image!', {type: 'error'});
			return;
		}
		if (!roomInputRef.current || roomInputRef.current.getTextInputState().value.trim() === '') {
			toast('Book location should not be an empty string!', {type: 'error'});
			return;
		}
		if (!amountInputRef.current || amountInputRef.current.getTextInputState().value.trim() === '' || parseInt(amountInputRef.current.getTextInputState().value.trim(), 10) <= 0) {
			toast('Book amount should not be an empty string and greater than 0!', {type: 'error'});
			return;
		}
		const response = await Api.createBook(bookNameInputRef.current.getTextInputState().value.trim(), genre.genreId, authors.map(x => x.authorId), selectedDate || new Date(), parseInt(roomInputRef.current.getTextInputState().value.trim(), 10), parseInt(amountInputRef.current.getTextInputState().value.trim(), 10), images);
		if (response && response.status === 200) {
			if (response.data.status === OK) {
				toast('Create book success!', {type: 'success'});
				setAuthors([]);
				setImages([]);
				setSelectedDate(new Date());
				setGenre(undefined);
				addImageInputRef.current?.setTextInputState({value: ''});
				bookNameInputRef.current?.setTextInputState({value: ''});
				roomInputRef.current?.setTextInputState({value: ''});
				amountInputRef.current?.setTextInputState({value: ''});
			} else {
				toast('Network error', {type: 'error'});
			}
		} else {
			toast('Network error', {type: 'error'});
		}
	}, [authors, genre, images, selectedDate]);

	const createBookButton = useMemo((): ReactNode => <div>
		<Button onClick={addBook}>Create</Button>
	</div>, [addBook]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto'}}>
			{bookInfo}
			{createBookButton}
			<ToastContainer />
		</div>
	);
};

export default AddBook;
