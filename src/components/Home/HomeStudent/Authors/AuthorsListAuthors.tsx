import {Button} from '@material-ui/core';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {AxiosResponse} from 'axios';
import React, {ChangeEvent, ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import {defaultTextInputState, TextInputStateType} from '../../../../@types/common/TextInput';
import {AuthorType} from '../../../../@types/entity';
import {OK} from '../../../../constants/Constant';
import ERROR_CODE from '../../../../constants/ErrorCode';
import PathName from '../../../../constants/PathName';
import useWindowDimensions, {WindowDimensionsType} from '../../../../hooks/useWindowDimensions';
import Api from '../../../../sagas/api';
import CustomModal from '../../../Common/CustomModal';
import Loading from '../../../Common/Loading';
import NetworkErrorModal from '../../../Common/NetworkErrorModal';
import TextInput from '../../../Common/TextInput';
import AuthorItem from './AuthorItem';

type CharType = {
	text: string;
	key: string;
}
const character: CharType[] = [{text: 'All', key: ''}, {text: 'A', key: 'A'}, {text: 'B', key: 'B'}, {text: 'C', key: 'C'}, {text: 'D', key: 'D'}, {text: 'E', key: 'E'}, {text: 'F', key: 'F'}, {text: 'G', key: 'G'}, {text: 'H', key: 'H'}, {text: 'I', key: 'I'}, {text: 'J', key: 'J'}, {text: 'K', key: 'K'}, {text: 'L', key: 'L'}, {text: 'M', key: 'M'}, {text: 'N', key: 'N'}, {text: 'O', key: 'O'}, {text: 'P', key: 'P'}, {text: 'Q', key: 'Q'}, {text: 'R', key: 'R'}, {text: 'S', key: 'S'}, {text: 'T', key: 'T'}, {text: 'U', key: 'U'}, {text: 'V', key: 'V'}, {text: 'W', key: 'W'}, {text: 'X', key: 'X'}, {text: 'Y', key: 'Y'}, {text: 'Z', key: 'Z'}];

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
	type ParamsType = {
		genreId: string;
	}
	const {genreId}: ParamsType = useParams();
	type TextInputHandleType = ElementRef<typeof TextInput>;
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const searchAuthorInputRef = useRef<TextInputHandleType>(null);
	const loadingModalRef = useRef<ModalHandleType>(null);
	const networkErrorModalRef = useRef<ModalHandleType>(null);
	const divElementRef = useRef<HTMLDivElement>(null);
	const {width}: WindowDimensionsType = useWindowDimensions();
	const [authorData, setAuthorData] = useState<AuthorType[]>([]);
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
		const getAuthorData = async () => {
			const response: AxiosResponse<any> | null= await Api.getAuthorsByGenreId(genreId);
			if (response && response.data) {
				if (response.data.status === OK) {
					setAuthorData(response.data.authors);
					loadingModalRef.current?.closeModal();
				} else {
					if (response.data.errorCode === ERROR_CODE.GET_AUTHOR_BY_GENRE_ERROR.GENRE_NOT_FOUND) {
						history.replace(PathName.Authors);
					} else {
						networkErrorModalRef.current?.openModal();
					}
				}
			} else {
				networkErrorModalRef.current?.openModal();
			}
		}
		getAuthorData()
	}, [genreId, history]);

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

	const networkErrorModal = useMemo((): ReactNode => (
		<NetworkErrorModal ref={networkErrorModalRef} />
	), []);

	const backButton = useMemo((): ReactNode => (
		<div>
			<Button onClick={goBack} style={{fontSize: 20}}>Back</Button>
		</div>
	), [goBack]);

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const searchAuthorInputState: TextInputStateType = searchAuthorInputRef.current?.getTextInputState() || defaultTextInputState;
		searchAuthorInputRef.current?.setTextInputState({...searchAuthorInputState, value: event.target.value});
		const searchText = new RegExp(event.target.value, 'i');
		setFilterData(updateFilterData(authorData.filter((author: AuthorType) => searchText.test(author.name))));
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

	return (
		<div style={{display: 'flex', flex: 1, height: '100%', overflowY: 'auto'}}>
			<div ref={divElementRef} style={{display: 'flex', flex: 1, marginLeft: 20, marginRight: 20, flexDirection: 'column'}}>
				{backButton}
				{searchInput}
				{authorDataView}
				{loadingModal}
				{networkErrorModal}
			</div>
		</div>
	);
}

export default AuthorsListAuthors;
