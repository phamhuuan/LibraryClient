import {Button} from '@material-ui/core';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import React, {ChangeEvent, ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {GetGenresActionType} from '../../../../@types/action';
import {defaultTextInputState, TextInputStateType} from '../../../../@types/common/TextInput';
import {GenreType} from '../../../../@types/entity';
import {RootReducerType} from '../../../../@types/reducer';
import {GET_ALL_GENRES, GET_ALL_GENRES_FAIL, GET_ALL_GENRES_SUCCESS} from '../../../../actions/ActionType';
import useWindowDimensions, {WindowDimensionsType} from '../../../../hooks/useWindowDimensions';
import Api from '../../../../sagas/api';
import CustomModal from '../../../Common/CustomModal';
import Loading from '../../../Common/Loading';
import TextInput from '../../../Common/TextInput';
import GenreItem from './GenreItem';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {OK} from '../../../../constants/Constant';
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

const AuthorsListGenres: FC = () => {
	const style = useStyles();
	
	const dispatch = useDispatch();
	const genresData = useSelector<RootReducerType, GenreType[]>((state) => state.genresReducer.data);
	const getGenresMessage = useSelector<RootReducerType, string>((state) => state.genresReducer.getGenresMessage);
	type TextInputHandleType = ElementRef<typeof TextInput>;
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const searchGenreInputRef = useRef<TextInputHandleType>(null);
	const createGenreInputRef = useRef<TextInputHandleType>(null);
	const loadingModalRef = useRef<ModalHandleType>(null);
	const divElementRef = useRef<HTMLDivElement>(null);
	const {width}: WindowDimensionsType = useWindowDimensions();
	const [filterData, setFilterData] = useState<GenreType[][]>([[]]);
	const [isShowCreateGenreView, setIsShowCreateGenreView] = useState<boolean>(false);

	const updateFilterData = useCallback((data: GenreType[]) => {
		if (data.length === 0) {
			return [[]];
		}
		if (divElementRef.current) {
			const numberOfColumn = Math.floor(divElementRef.current.clientWidth / 240);
			const newData: GenreType[][] = [];
			data.forEach((genre: GenreType, index: number) => {
				if (!newData[index % numberOfColumn]) {
					newData[index % numberOfColumn] = [];
				}
				newData[index % numberOfColumn].push(genre);
			});
			return newData;
		} else {
			return [[]];
		}
	}, []);

	useEffect(() => {
		if (genresData.length === 0) {
			dispatch<GetGenresActionType>({type: GET_ALL_GENRES});
		}
	}, [dispatch, genresData.length]);

	useEffect(() => {
		setFilterData(updateFilterData(genresData));
	}, [genresData, updateFilterData, width]);

	useEffect(() => {
		if (getGenresMessage === GET_ALL_GENRES_SUCCESS) {
			setFilterData(updateFilterData(genresData));
			loadingModalRef.current?.closeModal();
		} else if (getGenresMessage === GET_ALL_GENRES_FAIL) {
			loadingModalRef.current?.closeModal();
			toast('Network error', {type: 'error'});
		}
	}, [genresData, getGenresMessage, updateFilterData]);

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const searchGenreInputState: TextInputStateType = searchGenreInputRef.current?.getTextInputState() || defaultTextInputState;
		searchGenreInputRef.current?.setTextInputState({...searchGenreInputState, value: event.target.value});
		const searchText = new RegExp(event.target.value, 'i');
		setFilterData(updateFilterData(genresData.filter((genre: GenreType) => searchText.test(genre.name))));
	}, [genresData, updateFilterData]);

	const setShowCreateGenreView = () => {
		setIsShowCreateGenreView(true);
	};

	const setHideCreateGenreView = () => {
		setIsShowCreateGenreView(false);
	}

	const createNewGenre = useCallback(async () => {
		if (createGenreInputRef.current?.getTextInputState().value.trim()) {
			const response = await Api.createGenre(createGenreInputRef.current.getTextInputState().value);
			if (response && response.status === 200) {
				if (response.data.status === OK) {
					toast('Create genre success', {type: 'success'});
					dispatch<GetGenresActionType>({type: GET_ALL_GENRES});
					setIsShowCreateGenreView(false);
				} else {
					if (response.data.errorCode === ERROR_CODE.CREATE_GENRE_ERROR.GENRE_EXISTED) {
						toast('Genre already exist', {type: 'error'});
					} else {
						toast('Network error', {type: 'error'});
					}
				}
			} else {
				toast('Network error', {type: 'error'});
			}
		} else {
			toast('It could not be an empty string', {type: 'warning'});
		}
	}, [dispatch]);

	const createGenreView = useMemo((): ReactNode => {
		if (isShowCreateGenreView) {
			return (
				<div>
					<TextInput ref={createGenreInputRef} label={''} variant={'outlined'} style={{width: '100%'}} placeholder={'Enter genre name'} />
					<Button onClick={setHideCreateGenreView} color={'secondary'}>Cancel</Button>
					<Button onClick={createNewGenre} color={'primary'}>Save</Button>
				</div>
			);
		}
		return <Button onClick={setShowCreateGenreView}>Create new genre</Button>;
	}, [createNewGenre, isShowCreateGenreView]);

	const listGenresView = useMemo((): ReactNode => {
		if (!isShowCreateGenreView) {
			return (
				<div>
					<div style={{paddingTop: 10, width: '100%'}}>
						<TextInput ref={searchGenreInputRef} label={''} variant={'outlined'} style={{width: '100%'}} placeholder={'Enter genre name'} onChange={onChange} />
					</div>
					<div style={{display: 'flex', marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
						{filterData.map((genres: GenreType[], index: number): ReactNode =>  (
							<div key={index} style={{display: 'flex', flex: 1, flexDirection: 'column', marginRight: index !== filterData.length - 1 ? 10 : 0, marginLeft: index !== 0 ? 10 : 0}}>
								{genres.map((genre: GenreType, index: number): ReactNode => (
									<GenreItem genre={genre} key={index} />
								))}
							</div>
						))}
					</div>
				</div>
			)
		}
		return <div />;
	}, [isShowCreateGenreView, filterData, onChange]);

	return (
		<div style={{display: 'flex', flex: 1, height: '100%', overflowY: 'auto'}}>
			<div ref={divElementRef} style={{display: 'flex', flex: 1, marginLeft: 20, marginRight: 20, flexDirection: 'column'}}>
				{createGenreView}
				{listGenresView}
				<CustomModal ref={loadingModalRef} open className={style.paper}>
					<Loading />
				</CustomModal>
				<ToastContainer />
			</div>
		</div>
	);
}

export default AuthorsListGenres;
