import {Button} from '@material-ui/core';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import React, {ChangeEvent, ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router';
import {ToastContainer, toast} from 'react-toastify';
import {GetAuthorsByGenreIdActionType} from '../../../../@types/action';
import {defaultTextInputState, TextInputStateType} from '../../../../@types/common/TextInput';
import {AuthorType} from '../../../../@types/entity';
import {RootReducerType} from '../../../../@types/reducer';
import {GET_AUTHORS_BY_GENRE_ID, GET_AUTHORS_BY_GENRE_ID_FAIL, GET_AUTHORS_BY_GENRE_ID_SUCCESS} from '../../../../actions/ActionType';
import ERROR_CODE from '../../../../constants/ErrorCode';
import PathName from '../../../../constants/PathName';
import useWindowDimensions, {WindowDimensionsType} from '../../../../hooks/useWindowDimensions';
import CustomModal from '../../../Common/CustomModal';
import Loading from '../../../Common/Loading';
import TextInput from '../../../Common/TextInput';
import AuthorItem from './AuthorItem';
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

const AuthorsListAuthors: FC = () => {
	const style = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();
	const authorData = useSelector<RootReducerType, AuthorType[]>((state) => state.authorsReducer.data);
	const hasMoreAuthor = useSelector<RootReducerType, boolean>((state) => state.authorsReducer.hasMore);
	const getAuthorsByGenreIdMessage = useSelector<RootReducerType, string>((state) => state.authorsReducer.getAuthorsByGenreIdMessage);
	const currentGenreId = useSelector<RootReducerType, string>((state) => state.authorsReducer.currentGenreId);
	const getAuthorsByGenreIdErrorCode = useSelector<RootReducerType, number | undefined>((state) => state.authorsReducer.getAuthorsByGenreIdErrorCode);
	type ParamsType = {
		genreId: string;
	}
	const {genreId}: ParamsType = useParams();
	type TextInputHandleType = ElementRef<typeof TextInput>;
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const searchAuthorInputRef = useRef<TextInputHandleType>(null);
	const loadingModalRef = useRef<ModalHandleType>(null);
	const divElementRef = useRef<HTMLDivElement>(null);
	const {width}: WindowDimensionsType = useWindowDimensions();
	const [filterData, setFilterData] = useState<AuthorType[][]>([[]]);

	const updateFilterData = useCallback((data: AuthorType[]) => {
		if (data.length === 0) {
			return [[]];
		}
		if (divElementRef.current) {
			const numberOfColumn = Math.floor(divElementRef.current.clientWidth / 240);
			const newData: AuthorType[][] = [];
			data.forEach((author: AuthorType, index: number) => {
				if (!newData[index % numberOfColumn]) {
					newData[index % numberOfColumn] = [];
				}
				newData[index % numberOfColumn].push(author);
			});
			return newData;
		} else {
			return [[]];
		}
	}, []);

	useEffect(() => {
		if (getAuthorsByGenreIdMessage === GET_AUTHORS_BY_GENRE_ID_SUCCESS) {
			loadingModalRef.current?.closeModal();
			setFilterData(updateFilterData(authorData));
		} else if (getAuthorsByGenreIdMessage === GET_AUTHORS_BY_GENRE_ID_FAIL && getAuthorsByGenreIdErrorCode) {
			loadingModalRef.current?.closeModal();
			if (getAuthorsByGenreIdErrorCode === ERROR_CODE.GET_AUTHOR_BY_GENRE_ERROR.GENRE_NOT_FOUND) {
				history.replace(PathName.Authors + '/' + genreId);
			} else {
				toast('Network error', {type: 'error'});
			}
		}
	}, [authorData, genreId, getAuthorsByGenreIdErrorCode, getAuthorsByGenreIdMessage, history, updateFilterData]);

	useEffect(() => {
		if (currentGenreId !== genreId) {
			loadingModalRef.current?.openModal();
			dispatch<GetAuthorsByGenreIdActionType>({type: GET_AUTHORS_BY_GENRE_ID, genreId, lastId: '', lastName: '', limit: 20, resetData: true})
		}
	}, [currentGenreId, dispatch, genreId]);

	useEffect(() => {
		setFilterData(updateFilterData(authorData));
	}, [authorData, updateFilterData, width]);

	const goBack = useCallback((): void => {
		history.replace(PathName.Authors);
	}, [history]);

	const loadingModal = useMemo((): ReactNode => (
		<CustomModal ref={loadingModalRef} open className={style.paper}>
			<Loading />
		</CustomModal>
	), [style.paper]);

	const backButton = useMemo((): ReactNode => (
		<div>
			<Button onClick={goBack} style={{fontSize: 20}}>Back</Button>
		</div>
	), [goBack]);

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const searchAuthorInputState: TextInputStateType = searchAuthorInputRef.current?.getTextInputState() || defaultTextInputState;
		searchAuthorInputRef.current?.setTextInputState({...searchAuthorInputState, value: event.target.value});
		try {
			const searchText = new RegExp(event.target.value, 'i');
			setFilterData(updateFilterData(authorData.filter((author: AuthorType) => searchText.test(author.name))));
		} catch (error) {
			console.log(error);
		}
	}, [authorData, updateFilterData]);

	const searchInput = useMemo((): ReactNode => (
		<div style={{paddingTop: 10, width: '100%'}}>
			<TextInput ref={searchAuthorInputRef} label={''} variant={'outlined'} style={{width: '100%'}} placeholder={'Enter author name'} onChange={onChange} />
		</div>
	), [onChange]);

	const authorDataView = useMemo((): ReactNode => (
		<div style={{display: 'flex', marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
			{filterData.map((authors: AuthorType[], index: number): ReactNode =>  (
				<div key={index} style={{display: 'flex', flex: 1, flexDirection: 'column', marginRight: index !== filterData.length - 1 ? 10 : 0, marginLeft: index !== 0 ? 10 : 0}}>
					{authors.map((author: AuthorType, index: number): ReactNode => (
						<AuthorItem author={author} key={index} />
					))}
				</div>
			))}
		</div>
	), [filterData]);

	const getMoreAuthor = useCallback(() => {
		loadingModalRef.current?.openModal();
		dispatch<GetAuthorsByGenreIdActionType>({type: GET_AUTHORS_BY_GENRE_ID, genreId, lastId: authorData[authorData.length - 1].authorId, lastName: authorData[authorData.length - 1].name, limit: 20, resetData: false})
	}, [authorData, dispatch, genreId]);

	const seeMoreButton = useMemo((): ReactNode => {
		if (!hasMoreAuthor) return <div />;
		return (
			<div style={{display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'center'}}>
				<Button onClick={getMoreAuthor} variant={'contained'} color={'primary'} style={{paddingLeft: 50, paddingRight: 50, fontSize: 20}}>See more</Button>
			</div>
		);
	}, [getMoreAuthor, hasMoreAuthor]);

	return (
		<div style={{display: 'flex', flex: 1, height: '100%', overflowY: 'auto'}}>
			<div ref={divElementRef} style={{display: 'flex', flex: 1, marginLeft: 20, marginRight: 20, flexDirection: 'column'}}>
				{backButton}
				{searchInput}
				{authorDataView}
				{loadingModal}
				<ToastContainer />
				{seeMoreButton}
			</div>
		</div>
	);
}

export default AuthorsListAuthors;
