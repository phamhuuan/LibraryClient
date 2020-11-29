import {Button} from '@material-ui/core';
import React, {ElementRef, FC, ReactNode, useCallback, useMemo, useRef, useState} from 'react';
import {BookResponseType} from '../../../../@types/entity';
import {OK} from '../../../../constants/Constant';
import Api from '../../../../sagas/api';
import TextInput from '../../../Common/TextInput';

const parseDate = (data: string): string => {
	const dateData = new Date(data);
	const date = dateData.getDate();
	const month = dateData.getMonth() + 1;
	const year = dateData.getFullYear();
	return date + '/' + month + '/' + year;
};

const SearchScreen: FC = () => {
	type TextInputHandleType = ElementRef<typeof TextInput>;
	const searchInputRef = useRef<TextInputHandleType>(null);
	type StateType = {
		books: BookResponseType[];
		currentPage: number;
		totalPage: number;
		searchString: string;
	};
	const [state, setState] = useState<StateType>({
		books: [],
		currentPage: 1,
		totalPage: 0,
		searchString: '',
	});

	const onSearch = async (page: number): Promise<void> => {
		const response = await Api.getBooks(searchInputRef.current?.getTextInputState().value || '', page);
		if (response && response.data) {
			if (response.data.status === OK) {
				setState({
					books: response.data.books,
					currentPage: page,
					totalPage: response.data.totalPage,
					searchString: searchInputRef.current?.getTextInputState().value || '',
				});
			}
		}
	};

	const inputView = useMemo((): ReactNode => (
		<div style={{display: 'flex', flexDirection: 'row'}}>
			<div style={{marginLeft: 16, marginRight: 16, flex: 1}}>
				<TextInput ref={searchInputRef} placeholder={'Enter book name'} label={''} style={{width: '100%'}} />
			</div>
			<div>
				<Button onClick={() => onSearch(1)}>Search</Button>
			</div>
		</div>
	), []);

	const switchPageView = useMemo((): ReactNode => {
		if (state.totalPage > 0) {
			return (
				<div style={{display: 'flex', flexDirection: 'row'}}>
					<Button disabled={state.currentPage === 1} onClick={() => onSearch(state.currentPage - 1)}>Previous page</Button>
					<div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
						<p>Page {state.currentPage}/{state.totalPage}</p>
					</div>
					<Button disabled={state.currentPage === state.totalPage} onClick={() => onSearch(state.currentPage + 1)}>Next page</Button>
				</div>
			);
		}
		return <div />;
	}, [state.currentPage, state.totalPage]);

	const listBookView = useMemo((): ReactNode => (
		<div style={{overflowY: 'auto', marginBottom: 10}}>
			{state.books.map((book) => (
				<div style={{borderRadius: 16, backgroundColor: '#e7e7e7', marginTop: 10, padding: 10}}>
					<p>
						<strong>Title:</strong> {book.name}
						<br />
						<strong>Genre:</strong> {book.genre[0].name}
						<br />
						<strong>Publish date:</strong> {parseDate(book.publishDate)}
						<br />
						<strong>Author:</strong>
						{book.authors.map((author) => (
							<li>{author.name}</li>
						))}
					</p>
				</div>
			))}
		</div>
	), [state.books]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
			{inputView}
			{switchPageView}
			{listBookView}
		</div>
	)
};

export default SearchScreen;
